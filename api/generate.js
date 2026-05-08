export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: "Method Not Allowed"});
    
    const { city, days } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `Act as a world-class travel concierge. Create a stunning ${days}-day itinerary for ${city}. 
                   Format strictly in HTML. Use Tailwind CSS classes for styling (cards, soft colors, bold headings). 
                   Include:
                   - A Daily Theme.
                   - Morning, Afternoon, and Evening activities.
                   - A "Must-Try Local Dish" section for each day.
                   - Important travel tips (Currency, Transport).
                   Output should be professional, clean, and international.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        res.status(200).json({ content: data.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(500).json({ error: "API Failure" });
    }
}
