export default async function handler(req, res) {
    const { city, days } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Generate a detailed travel itinerary for ${city} for ${days} days in HTML format.` }] }]
            })
        });

        const data = await response.json();

        // إيلا عطاك Model not found، غانعرفو بلي جوجل عندها مشكل فـ الـ Region ديالك
        if (data.error) {
            return res.status(200).json({ content: `Google Error: ${data.error.message}` });
        }

        res.status(200).json({ content: data.candidates[0].content.parts[0].text });
    } catch (e) {
        res.status(500).json({ error: "Server Error" });
    }
}
