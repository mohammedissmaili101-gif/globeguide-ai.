document.addEventListener("DOMContentLoaded", function() {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌍</text></svg>";
    document.head.appendChild(favicon);

    const headerHTML = `
    <nav style="background:rgba(255,255,255,0.9); backdrop-filter:blur(10px); position:sticky; top:0; z-index:100; border-bottom:1px solid #eee; padding:12px 20px; display:flex; justify-content:space-between; align-items:center;">
        <a href="index.html" style="text-decoration:none; display:flex; align-items:center; gap:8px;">
            <div style="background:#2563eb; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:white; font-weight:900;">G</div>
            <span style="font-size:18px; font-weight:800; color:#0f172a;">GlobeGuide AI</span>
        </a>
        <a href="generate.html" style="text-decoration:none; background:#0f172a; color:white; padding:8px 15px; border-radius:50px; font-size:11px; font-weight:800; text-transform:uppercase;">Tool →</a>
    </nav>`;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
});
