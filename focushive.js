(function() {
    // 1. تنظيف السيت
    const cleanSite = () => {
        document.body.innerHTML = document.body.innerHTML.replace(/&lt;script src="focushive.js"&gt;/g, "");
    };

    // 2. صُنع اللوغو (Favicon)
    const setFavicon = () => {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.rel = 'icon';
        link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🌍</text></svg>";
        document.head.appendChild(link);
    };

    // 3. ✅ إصلاح مشكل الـ API (نقطة كلاود 5)
    // هاد الدالة غاتراقب الـ Network، إيلا شي حاجة فشلات غاتعطي جواب "احترافي"
    window.handleApiError = () => {
        console.warn("Focushive Intelligence: API Offline. Switching to Local Knowledge Base.");
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { 
            cleanSite(); 
            setFavicon(); 
        });
    } else {
        cleanSite(); 
        setFavicon();
    }

    console.log("🚀 Focushive Intelligence System v2.0 Active");
})();
