(function() {
    // 1. تنظيف السيت: كيمسح أي Navbar قديم وأي كتيبة زايدة فـ القاع
    const cleanSite = () => {
        const oldNav = document.querySelector('nav, header');
        if (oldNav) oldNav.remove();
        // كيمسح داك السطر اللي كيبان ليك كتابة فـ القاع
        document.body.innerHTML = document.body.innerHTML.replace(/&lt;script src="focushive.js"&gt;/g, "");
    };

    // 2. صُنع اللوغو الخارجي (اللي فـ التبويب 🌍)
    const setFavicon = () => {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🌍</text></svg>";
        document.head.appendChild(link);
    };

    // 3. صُنع الـ Navbar الجديد (اللوغو اللي لداخل)
    const setNavbar = () => {
        const nav = `
        <nav style="background:white; border-bottom:1px solid #eee; padding:12px 20px; position:sticky; top:0; z-index:9999; display:flex; justify-content:space-between; align-items:center; font-family: sans-serif;">
            <a href="index.html" style="text-decoration:none; display:flex; align-items:center; gap:8px;">
                <div style="background:#2563eb; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:white; font-weight:900;">G</div>
                <span style="font-size:18px; font-weight:800; color:#0f172a; letter-spacing:-0.5px;">GlobeGuide AI</span>
            </a>
            <a href="generate.html" style="text-decoration:none; background:#0f172a; color:white; padding:8px 16px; border-radius:50px; font-size:11px; font-weight:800; text-transform:uppercase;">Tool →</a>
        </nav>`;
        document.body.insertAdjacentHTML('afterbegin', nav);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { cleanSite(); setFavicon(); setNavbar(); });
    } else {
        cleanSite(); setFavicon(); setNavbar();
    }
})();
