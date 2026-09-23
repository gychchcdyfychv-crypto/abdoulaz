document.addEventListener('DOMContentLoaded', () => {
    const wilayaSelect = document.getElementById('wilaya');
    const baladiyaSelect = document.getElementById('baladiya');
    const leadForm = document.getElementById('leadForm');
    const modal = document.getElementById('leadModal');
    const submitBtn = document.getElementById('submitBtn');

    // كائن لتخزين الولايات والبلديات التابعة لها
    let algeriaData = {};

    // 1. جلب ومعالجة بيانات الولايات والبلديات
    fetch('/static/algeria_cities.json')
        .then(response => response.json())
        .then(data => {
            // تجميع البيانات: ولاية -> [قائمة البلديات]
            data.forEach(item => {
                const wilayaName = item.wilaya_name; // الاسم بالعربية
                const communeName = item.commune_name; // الاسم بالعربية

                if (!algeriaData[wilayaName]) {
                    algeriaData[wilayaName] = [];
                }
                // إضافة البلدية إذا لم تكن موجودة مسبقاً
                if (!algeriaData[wilayaName].includes(communeName)) {
                    algeriaData[wilayaName].push(communeName);
                }
            });

            // تعبئة قائمة الولايات
            for (const wilaya in algeriaData) {
                const option = document.createElement('option');
                option.value = wilaya;
                option.textContent = wilaya;
                wilayaSelect.appendChild(option);
            }
        })
        .catch(error => console.error('خطأ في تحميل بيانات المدن:', error));

    // 2. عند اختيار ولاية، تظهر البلديات التابعة لها
    wilayaSelect.addEventListener('change', (e) => {
        const selectedWilaya = e.target.value;
        baladiyaSelect.innerHTML = '<option value="">اختر البلدية</option>'; // تفريغ القائمة

        if (selectedWilaya && algeriaData[selectedWilaya]) {
            // ترتيب البلديات أبجدياً
            const sortedBaladiyas = algeriaData[selectedWilaya].sort((a, b) => 
                a.localeCompare(b, 'ar')
            );
            
            sortedBaladiyas.forEach(baladiya => {
                const option = document.createElement('option');
                option.value = baladiya;
                option.textContent = baladiya;
                baladiyaSelect.appendChild(option);
            });
        }
    });

    // 3. إرسال النموذج (نفس الكود السابق)
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            wilaya: wilayaSelect.value,
            baladiya: baladiyaSelect.value
        };

        submitBtn.textContent = 'جاري الإرسال...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert('تم إرسال معلوماتك بنجاح! سنتواصل معك قريباً.');
                modal.style.display = 'none';
            } else {
                alert('حدث خطأ: ' + result.message);
            }
        } catch (error) {
            alert('تعذر الاتصال بالسيرفر. يرجى المحاولة لاحقاً.');
        } finally {
            submitBtn.textContent = 'إرسال الطلب';
            submitBtn.disabled = false;
        }
    });
});
