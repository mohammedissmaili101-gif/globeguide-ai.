export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: "Method Not Allowed"});
    
    const { city, days } = req.body;

    // حط الساروت ديالك هنا نيشان بين " " 
    // مثال: const apiKey = "AIzaSyB..."
    const apiKey = "AIzaSyAXVORJSB3R9LINq9ieNqjgsHB8PyVsadE"; 

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: `Generate a 3-day travel plan for ${city} in HTML format.` }] }] 
            })
        });
        
        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ content: `Google API Error: ${data.error.message}` });
        }

        res.status(200).json({ content: data.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(200).json({ content: "Connection Failed. Please check the API key." });
    }
}
