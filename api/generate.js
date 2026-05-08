export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ content: "Error: GROQ_API_KEY is missing." });
    }

    const prompt = `
        Create a luxury, high-end travel itinerary for ${city} for ${days} days.
        
        Mandatory Structure:
        1. START with this Google Maps Embed (Replace {city} with the actual city name):
           <iframe width="100%" height="400" style="border-radius:24px; margin-bottom:30px; border:none;" src="https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
        
        2. FOR EACH DAY:
           - <h2>Day Title</h2>
           - Include ONE unique image of a specific landmark mentioned:
             <img src="https://loremflickr.com/800/450/${city},[LANDMARK]/all?random=[DAY]" alt="Landmark" style="width:100%; border-radius:24px; margin:20px 0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
           - Replace [LANDMARK] with the place name and [DAY] with the day number.
           - Use <h3> for locations and <ul><li> for activities.
        
        3. RULES: Output ONLY raw HTML. No markdown, no backticks, no talk.
        4. Tone: Upscale. Language: English.
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a professional travel concierge. Output ONLY pure HTML code." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 3500
            })
        });

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        content = content.replace(/```html|```/g, "").trim();

        res.status(200).json({ content: content });

    } catch (error) {
        res.status(200).json({ content: "Connection failed. Please try again." });
    }
}
