// المسار: api/intelligence.js
export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY; 
  // كنجيبو أخبار السفر والتحركات العالمية دابا
  const url = `https://newsapi.org/v2/everything?q=travel+security+safety&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const positiveWords = ['opening', 'festival', 'safe', 'growth', 'unlocked', 'luxury', 'stable'];
    const negativeWords = ['strike', 'war', 'danger', 'closed', 'storm', 'crisis', 'threat', 'warning'];

    const analysis = data.articles.slice(0, 12).map(article => {
      let score = 75; // نقطة بداية محايدة
      const text = (article.title + (article.description || "")).toLowerCase();
      
      positiveWords.forEach(word => { if(text.includes(word)) score += 8; });
      negativeWords.forEach(word => { if(text.includes(word)) score -= 18; });
      
      return {
        source: article.source.name,
        headline: article.title,
        impactScore: Math.max(5, Math.min(100, score)),
        url: article.url, // الرابط الحقيقي للمقال
        publishedAt: article.publishedAt
      };
    });

    res.status(200).json({ analysis });
  } catch (error) {
    res.status(500).json({ error: "Uplink Failed" });
  }
}
