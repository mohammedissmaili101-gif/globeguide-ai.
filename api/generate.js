export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) return res.status(200).json({ content: "Error: GROQ_API_KEY is missing." });

    // الـ Prompt الجديد كيركز على الهيكلة البصرية (Visual Structure)
    const prompt = `
        Create a world-class, ultra-luxury travel itinerary for ${city} for ${days} days.
        
        MANDATORY HTML STRUCTURE PER DAY:
        1. Wrap EACH DAY in: <div style="margin-bottom: 40px; padding: 30px; background: #ffffff; border-radius: 32px; border: 1px solid #f1f5f9; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
        2. Day Title: <h2 style="color: #1e3a8a; font-size: 2rem; font-weight: 800; border-left: 6px solid #2563eb; padding-left: 15px; margin-bottom: 20px;">Day X: [Title]</h2>
        3. Daily Vibe: A sophisticated paragraph about the mood.
        4. Locations: Use <h3>[Icon] Location Name</h3> with deep professional insights (4-5 sentences each).
        5. Pro Tips: Wrap in <div style="background: #f8fafc; padding: 15px; border-radius: 15px; border-left: 4px solid #64748b; margin: 15px 0; font-style: italic; font-size: 0.9rem;">Pro Tip: [Insight]</div>
        6. Activities: Use <ul> and <li> for the hourly schedule.

        CRITICAL: 
        - Output ONLY the HTML content. 
        - DO NOT use markdown, backticks (\`\`\`), or <html>/<body> tags.
        - Language: English. Tone: Elite Concierge.
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${apiKey}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile", // استعملت 70b هنا حيت أذكى فالتنظيم، إيلا بغيتي السرعة خلي 8b
                messages: [
                    { 
                        role: "system", 
                        content: "You are a professional travel architect. You only output perfectly formatted HTML snippets. No chatter, no markdown." 
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5, // هبطنا الحرارة شوية باش يبقى ملتزم بالتنظيم وما يبقاش يخربق
                max_tokens: 4000
            })
        });

        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
            throw new Error("No response from AI");
        }

        let content = data.choices[0].message.content.trim();
        
        // تنظيف الكود من أي زوائد ممكنة
        content = content.replace(/```html/g, "").replace(/```/g, "");

        res.status(200).json({ content: content });
    } catch (error) {
        console.error("API Error:", error);
        res.status(200).json({ content: "<p style='color:red;'>System update in progress. Please refresh and try again in 10 seconds.</p>" });
    }
}
