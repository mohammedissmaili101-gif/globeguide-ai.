export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: "Method Not Allowed"});
    
    const { city, days } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // هاد السطر غايخلينا نعرفو واش الساروت واصل للسيرفر
    if (!apiKey) {
        return res.status(200).json({ content: "Error: API Key is missing on Vercel side." });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contents: [{ parts: [{ text: `Create a trip to ${city} for ${days} days.` }] }] })
        });
        
        const data = await response.json();

        // إيلا كان مشكل فـ الساروت من عند جوجل
        if (data.error) {
            return res.status(200).json({ content: `Google API Error: ${data.error.message}` });
        }

        res.status(200).json({ content: data.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(200).json({ content: "Connection Failed: Could not reach Gemini API." });
    }
}
