(function() {
    // 1. تنظيف السيت: كيمسح أي كتيبة زايدة ناتجة عن أخطاء الربط
    const cleanSite = () => {
        // كيمسح داك السطر اللي كيبان كتابة فـ القاع بسبب غلط في وسم script
        document.body.innerHTML = document.body.innerHTML.replace(/&lt;script src="focushive.js"&gt;/g, "");
    };

    // 2. صُنع اللوغو الخارجي (اللي كيبان فوق في التبويب 🌍)
    const setFavicon = () => {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.rel = 'icon';
        link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🌍</text></svg>";
        document.head.appendChild(link);
    };

    // حيدنا دالة setNavbar حيت صافي صايبنا Navbar حسن منها في HTML

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { cleanSite(); setFavicon(); });
    } else {
        cleanSite(); setFavicon();
    }
})();
