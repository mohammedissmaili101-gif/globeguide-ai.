// المسار: api/alerts.js
export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY; 
  // البوت هنا كيركز على "التحذيرات" و "تغييرات الفيزا" و "المخاطر"
  const url = `https://newsapi.org/v2/everything?q=(travel+warning+OR+airport+strike+OR+visa+requirements+OR+travel+risk)&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Alerts Radar is offline" });
  }
}
