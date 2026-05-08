export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    
    // تأكد من إضافة GROQ_API_KEY في إعدادات Vercel
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ content: "Error: GROQ_API_KEY is missing." });
    }

    // الـ Prompt المطور لجلب الصور والتنسيق
    const prompt = `
        Create a luxury, high-end travel itinerary for ${city} for ${days} days.
        
        Strict Rules:
        1. Use ONLY raw HTML tags. No markdown blocks.
        2. Format: <h2> for Days, <h3> for Landmarks, <p> for descriptions, <ul>/<li> for lists.
        3. For EACH DAY, include one relevant image using this exact HTML structure:
           <img src="https://images.unsplash.com/photo-1?auto=format&fit=crop&w=800&q=80&${city},landmark" alt="Travel Image" style="width:100%; border-radius:20px; margin:20px 0; border: 1px solid #e2e8f0;">
        4. End with a "Pro Travel Tip" section.
        5. Tone: Inspiring, professional, and upscale.
        6. Language: English.
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // أسرع نموذج حالياً
                messages: [
                    {
                        role: "system",
                        content: "You are an expert travel concierge. You provide stunning, highly-structured HTML travel guides."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.6,
                max_tokens: 2000
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ content: `Groq Error: ${data.error.message}` });
        }

        let content = data.choices[0].message.content.trim();
        
        // تنظيف أي زوائد برمجية
        content = content.replace(/```html|```/g, "");

        res.status(200).json({ content: content });

    } catch (error) {
        console.error("API Error:", error);
        res.status(200).json({ content: "The AI engine is taking a break. Please try again in a moment." });
    }
}
