export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

    if (!apiKey) return res.status(200).json({ content: "API Key Missing in Vercel Settings." });

    const prompt = `
        Create a luxury, high-end travel itinerary for ${city} for ${days} days.
        
        Strict Formatting Requirements:
        1. Use <h2> for Day Titles (e.g., <h2>Day 1: Arrival & Exploration</h2>).
        2. Use <h3> for specific landmarks or activities.
        3. Use <p> for engaging, descriptive paragraphs.
        4. Use <ul> and <li> for lists of highlights or tips.
        5. Output ONLY raw HTML. Do NOT include markdown code blocks (\`\`\`html).
        6. Tone: Professional, upscale, and inspiring.
        7. Language: English.
    `;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        if (data.error) return res.status(200).json({ content: `Google API Error: ${data.error.message}` });

        let content = data.candidates[0].content.parts[0].text.replace(/```html|```/g, "").trim();
        res.status(200).json({ content: content });

    } catch (error) {
        res.status(200).json({ content: "Server connection failed." });
    }
}
