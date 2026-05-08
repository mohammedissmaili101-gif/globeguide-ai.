export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: "Method Not Allowed"});
    
    const { city, days } = req.body;

    // حط الساروت ديالك هنا نيشان
    const apiKey = "AIzaSyCXmDz3vcPS-KBKlwPQ8nw1Q4b6xin_F6c"; 

    try {
        // استعملنا موديل gemini-pro و v1beta
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: `Write a short travel itinerary for ${city} for ${days} days in HTML format.` }] }] 
            })
        });
        
        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ content: `Google API Error: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            res.status(200).json({ content: data.candidates[0].content.parts[0].text });
        } else {
            res.status(200).json({ content: "Please try again with a different city." });
        }
    } catch (error) {
        res.status(200).json({ content: "Connection error. Please check your API key." });
    }
}
