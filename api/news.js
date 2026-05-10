// المسار: api/news.js
export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY; 
  const url = `https://newsapi.org/v2/everything?q=travel+visa+tourism&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // إعدادات الـ CORS باش يسمح للسيت ديالك فقط يقرأ البيانات
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
