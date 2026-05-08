export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    
    // هاد السطر كيمسح أي فراغات يقدر يكونو دازو فـ Paste
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

    if (!apiKey) {
        return res.status(200).json({ content: "DEBUG: API Key is missing in Vercel Settings!" });
    }

    try {
        // استعملنا الرابط الأكثر استقراراً حالياً
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Create a professional ${days}-day travel itinerary for ${city} in HTML format.` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // هاد السطر غايقول لينا الغلط فين كاين بالضبط
            return res.status(200).json({ content: `Google API Error: ${data.error.message} (Status: ${data.error.status})` });
        }

        if (data.candidates && data.candidates[0].content) {
            res.status(200).json({ content: data.candidates[0].content.parts[0].text });
        } else {
            res.status(200).json({ content: "AI returned no content. Try a different city." });
        }

    } catch (error) {
        res.status(200).json({ content: "Connection Failed: Check your internet or API settings." });
    }
}
