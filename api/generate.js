export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: "Method Not Allowed"});
    
    const { city, days } = req.body;
    
    // هنا كنقراو الساروت من Vercel Settings ماشي من الكود
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

    if (!apiKey) {
        return res.status(200).json({ content: "Error: API Key is missing in Vercel Settings." });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                contents: [{ 
                    parts: [{ text: `Create a professional and detailed ${days}-day travel itinerary for ${city} in HTML format. Use beautiful headings, bullet points, and emojis.` }] 
                }] 
            })
        });
        
        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ content: `Google API Error: ${data.error.message}` });
        }

        res.status(200).json({ content: data.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(200).json({ content: "Connection Failed. Please check your settings." });
    }
}
