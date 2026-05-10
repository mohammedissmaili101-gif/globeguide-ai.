// المسار: api/deals.js
export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY; 
  // هنا البوت كيقلب حصرياً على العروض والهميزات ديال الوكالات
  const url = `https://newsapi.org/v2/everything?q=(travel+deals+OR+vacation+offers+OR+cheap+flights)&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Deals Bot is offline" });
  }
}
