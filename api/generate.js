export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) return res.status(200).json({ content: "Error: GROQ_API_KEY missing." });

    const prompt = `
        Create a luxury, high-end travel itinerary for ${city} for ${days} days.
        
        Structure:
        1. Start with a brief, inspiring introduction.
        2. For EACH DAY, use <h2>Day X: Title</h2>.
        3. Inside each day, use <h3>Landmark Name</h3> for the main attraction.
        4. Use <p> for descriptions and <ul><li> for activities.
        5. DO NOT include <img> tags or iframes in your response. I will add them via code.
        6. Output ONLY raw HTML. No markdown, no backticks.
        7. Tone: Upscale. Language: English.
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
                    { role: "system", content: "You are a professional travel concierge. Output ONLY clean HTML body content." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 3000
            })
        });

        const data = await response.json();
        let content = data.choices[0].message.content.trim().replace(/```html|```/g, "");
        res.status(200).json({ content: content });
    } catch (error) {
        res.status(200).json({ content: "Server Error. Please try again." });
    }
}
