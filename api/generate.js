export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    
    // هاد السطر كيتأكد بلي الساروت ماشي غير كاين، ولكن راه خدام
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";

    if (apiKey.length < 10) {
        return res.status(200).json({ content: "خطأ تقني: Vercel مازال ما قراش الساروت. تأكد من تفعيل خانة Production ودير Redeploy." });
    }

    try {
        // جربنا v1 اللي هي أكثر استقراراً دابا
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Write a short 3-line travel plan for ${city} in HTML.` }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ content: `Google Error: ${data.error.message}` });
        }

        res.status(200).json({ content: data.candidates[0].content.parts[0].text });

    } catch (error) {
        res.status(200).json({ content: "Connection Failed. Please try again." });
    }
}
