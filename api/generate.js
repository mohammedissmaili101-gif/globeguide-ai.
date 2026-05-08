export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: "Method Not Allowed"});
    
    const { city, days } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ content: "Error: API Key is missing on Vercel side." });
    }

    try {
        // استعملنا v1beta مع gemini-1.5-flash-latest
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                contents: [{ 
                    parts: [{ text: `Write a travel itinerary for ${city} for ${days} days in English. Use HTML tags like <h3> and <ul>.` }] 
                }] 
            })
        });
        
        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ content: `Google API Error: ${data.error.message}` });
        }

        if (!data.candidates || data.candidates.length === 0) {
            return res.status(200).json({ content: "AI returned no results. Try another city." });
        }

        res.status(200).json({ content: data.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(200).json({ content: "Connection Failed: Could not reach Gemini API." });
    }
}
