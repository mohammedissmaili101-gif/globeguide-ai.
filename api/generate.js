export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

    const { city, days } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) return res.status(200).json({ content: "Error: Configuration missing." });

    const prompt = `
        Create an elite travel itinerary for ${city} for ${days} days.
        STRUCTURE:
        - Wrap each day in: <div class="day-card">
        - Day Title: <h2 class="day-title">Day X: [Title]</h2>
        - Vibe: <p class="vibe">[3 sentences]</p>
        - Locations: <h3>[Icon] Name</h3> <p>[Deep insight]</p>
        - Pro Tip: <div class="tip-box">Tip: [Insight]</div>
        - Schedule: <ul><li>[Activity]</li></ul>
        ONLY HTML. No markdown. English.
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a professional travel architect. Output only clean HTML." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 2500 // تقليل الحجم لضمان عدم وقوع "Crash"
            })
        });

        const data = await response.json();
        let content = data.choices[0].message.content.trim().replace(/```html|```/g, "");
        res.status(200).json({ content: content });
    } catch (error) {
        res.status(200).json({ content: "<p class='text-red-500'>Connection slow. Please try again.</p>" });
    }
}
