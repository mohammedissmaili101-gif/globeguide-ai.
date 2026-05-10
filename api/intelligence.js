// المسار: api/intelligence.js
export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY;
  // كنجيبو أخبار السفر العالمية الحالية
  const url = `https://newsapi.org/v2/everything?q=travel+tourism&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // منطق ذكي بسيط لتحليل الوضع (Sentiment Analysis)
    const positiveWords = ['opening', 'festival', 'safe', 'growth', 'deals', 'luxury', 'new'];
    const negativeWords = ['strike', 'war', 'closed', 'danger', 'storm', 'cancel', 'crisis'];

    const analysis = data.articles.slice(0, 10).map(article => {
      let score = 70; // نقطة البداية
      const text = (article.title + article.description).toLowerCase();
      
      positiveWords.forEach(word => { if(text.includes(word)) score += 10; });
      negativeWords.forEach(word => { if(text.includes(word)) score -= 20; });
      
      return {
        source: article.source.name,
        headline: article.title,
        impactScore: Math.max(10, Math.min(100, score)),
        region: "Global Node"
      };
    });

    res.status(200).json({ analysis });
  } catch (error) {
    res.status(500).json({ error: "Intelligence Uplink Failed" });
  }
}
