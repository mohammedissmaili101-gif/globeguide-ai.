export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    
    // تأكد من إضافة GROQ_API_KEY في إعدادات Vercel
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ content: "Error: GROQ_API_KEY is missing in Vercel settings." });
    }

    // الـ Prompt المطور لجلب الصور بجودة عالية وتنسيق فاخر
    const prompt = `
        Create a luxury, high-fidelity travel itinerary for ${city} for ${days} days.
        
        Strict Formatting Rules:
        1. Use ONLY raw HTML tags. Do NOT use markdown code blocks or backticks.
        2. Structure: <h2> for Day Titles, <h3> for Landmarks, <p> for descriptions, <ul> and <li> for activity lists.
        3. For EACH DAY, you MUST include one stunning, high-quality image using this EXACT HTML:
           <img src="https://loremflickr.com/800/450/${city},travel/all" alt="${city}" style="width:100%; border-radius:24px; margin:24px 0; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
        4. Provide a "Pro Travel Tip" at the end of the guide.
        5. Tone: Upscale and inspiring. Language: English.
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", 
                messages: [
                    {
                        role: "system",
                        content: "You are an expert travel concierge. You output ONLY valid, raw HTML. No chat, no intro, no markdown."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 3000
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ content: `Groq Error: ${data.error.message}` });
        }

        if (data.choices && data.choices[0].message) {
            let content = data.choices[0].message.content.trim();
            
            // تنظيف إضافي للتأكد من عدم وجود وسم ```html
            content = content.replace(/```html|```/g, "").trim();

            res.status(200).json({ content: content });
        } else {
            res.status(200).json({ content: "AI failed to generate a response. Please try again." });
        }

    } catch (error) {
        console.error("API Error:", error);
        res.status(200).json({ content: "Server connection failed. Check your Groq API key." });
    }
}
