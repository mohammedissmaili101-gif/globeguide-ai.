export default async function handler(req, res) {
    // التأكد من أن الطلب هو POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { city, days } = req.body;

    // جلب الساروت من إعدادات Vercel (Environment Variables)
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

    if (!apiKey) {
        return res.status(200).json({ content: "خطأ: الساروت (API Key) غير موجود في إعدادات Vercel." });
    }

    // الـ Prompt المطور لضمان أفضل نتيجة وتنسيق
    const prompt = `
        Create a professional, high-fidelity travel itinerary for ${city} for ${days} days.
        
        IMPORTANT INSTRUCTIONS:
        1. Format the response using clean HTML tags: <h2> for day titles, <h3> for locations, and <p> for descriptions.
        2. Use bullet points <ul> and <li> for lists of activities.
        3. Do NOT include markdown code blocks like \`\`\`html or \`\`\`.
        4. Use emojis to make the guide engaging.
        5. Provide a brief "Pro Travel Tip" at the end.
        6. Language: English.
    `;

    try {
        // رابط طلب الخدمة من Google Gemini 2.5 Flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        // التعامل مع أخطاء Google API
        if (data.error) {
            return res.status(200).json({ content: `Google API Error: ${data.error.message}` });
        }

        // استخراج النص من الاستجابة وتنظيفه
        if (data.candidates && data.candidates[0].content) {
            let content = data.candidates[0].content.parts[0].text;
            
            // تنظيف أي وسوم برمجية زائدة
            content = content.replace(/```html|```/g, "").trim();

            res.status(200).json({ content: content });
        } else {
            res.status(200).json({ content: "الذكاء الاصطناعي لم يستطع توليد رد. حاول مرة أخرى." });
        }

    } catch (error) {
        console.error("API Error:", error);
        res.status(200).json({ content: "فشل الاتصال بالسيرفر. تأكد من إعدادات الـ API Key." });
    }
}
