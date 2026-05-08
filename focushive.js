document.addEventListener("DOMContentLoaded", function() {
    // 1. صُنع اللوغو الخارجي (Favicon) أوتوماتيكياً
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌍</text></svg>";
    document.head.appendChild(favicon);

    // 2. صُنع اللوغو الداخلي والمنيو (Navbar)
    const headerHTML = `
    <nav style="background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid #f1f5f9; padding: 15px 30px;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; font-family: 'Plus Jakarta Sans', sans-serif;">
            <a href="index.html" style="text-decoration: none; display: flex; align-items: center; gap: 10px;">
                <div style="background: #2563eb; width: 35px; height: 35px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; box-shadow: 0 4px 12px rgba(37,99,235,0.2);">G</div>
                <span style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -1px;">Globe<span style="color: #2563eb;">Guide</span> AI</span>
            </a>
            <div style="display: flex; gap: 25px; align-items: center;">
                <a href="index.html" style="text-decoration: none; color: #64748b; font-size: 14px; font-weight: 600;">Home</a>
                <a href="generate.html" style="text-decoration: none; background: #0f172a; color: white; padding: 10px 20px; border-radius: 50px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Use Tool →</a>
            </div>
        </div>
    </nav>
    `;
    
    // وضع المنيو في أول الصفحة
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
});
