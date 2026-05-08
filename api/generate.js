export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) return res.status(200).json({ content: "Error: GROQ_API_KEY is missing." });

    const prompt = `
        Create an ultra-luxury, high-end, and extremely detailed travel itinerary for ${city} for ${days} days.
        
        Mandatory Structure:
        1. FOR EACH DAY:
           - Use <h2>Day X: [Catchy & Professional Title]</h2>
           - Start with a "Daily Vibe" paragraph (3-4 sentences) explaining the mood and what to expect.
           - Use <h3> for each specific landmark or location.
           - For each location, provide a DEEP explanation (History, why it's famous, and what makes it special).
           - Add a "Pro Tip" for each location (e.g., best photo spot, local snack to try nearby).
           - Use <ul> and <li> for the schedule of activities.

        2. IMPORTANT:
           - Output ONLY raw HTML. No <img> tags, no markdown, no backticks.
           - Tone: Elite, sophisticated, and informative.
           - Language: English.
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are an elite travel concierge. You provide long, detailed, and clean HTML itineraries without images." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.6,
                max_tokens: 4000
            })
        });

        const data = await response.json();
        let content = data.choices[0].message.content.trim().replace(/```html|```/g, "");
        res.status(200).json({ content: content });
    } catch (error) {
        res.status(200).json({ content: "Connection failed. Please try again." });
    }
}
