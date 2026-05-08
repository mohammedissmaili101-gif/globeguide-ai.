export default async function handler(req, res) {
    const apiKey = "AIzaSyCXmDz3vcPS-KBKlwPQ8nw1Q4b6xin_F6c"; 

    try {
        // كنطلبوا من جوجل تعطينا كاع الموديلات اللي عندنا الحق نخدمو بيهم
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ content: "خطأ في الساروت: " + data.error.message });
        }

        // غانخرجو سميات الموديلات المتاحة ليك
        const models = data.models ? data.models.map(m => m.name).join(", ") : "لا توجد موديلات متاحة";
        res.status(200).json({ content: "الموديلات المتاحة لحسابك هي: " + models });

    } catch (e) {
        res.status(200).json({ content: "فشل الاتصال بجوجل." });
    }
}
