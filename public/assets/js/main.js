import { supabase } from './supabase-config.js';

let currentUser = null;
let currentProfile = null;
let currentLang = localStorage.getItem('dashboard_lang') || 'ar';
let activeQrCodeInstance = null;

const translations = {
    ar: {
        page_title: "Keymerv | لوحة التحكم",
        tab_links: "الروابط",
        tab_store: "المتجر الخفيف",
        tab_branches: "الفروع",
        tab_qrcode: "مولد الـ QR",
        tab_settings: "الإعدادات",
        logout: "تسجيل الخروج",
        links_title: "إدارة الروابط والمنصات",
        links_desc: "أضف روابطك والمنصات الـ 30 المقسمة بذكاء لتظهر بأيقوناتها الاحترافية",
        add_link_heading: "إضافة رابط عام إضافي",
        btn_add_link: "إضافة الرابط العام",
        btn_save_social: "حفظ جميع المنصات",
        cat_social: "سوشيال ميديا أساسية",
        cat_media: "بث وتصوير وترفيه",
        cat_dev: "مجتمعات وبرمجة وأعمال",
        cat_extra: "منصات إضافية أخرى",
        store_title: "المتجر المصغر",
        store_desc: "استعرض منتجاتك الرقمية أو المادية بأسلوب عصري",
        badge_soon: "قريباً جداً",
        store_coming_title: "ميزة المتجر الخفيف قادمة في التحديث القادم",
        store_coming_desc: "نعمل حالياً على تطوير نظام مبيعات متكامل وخفيف يتيح لعملائك الشراء مباشرة من صفحتك الشخصية بكل سهولة.",
        btn_coming_soon: "إضافة منتج (قريباً)",
        branches_title: "إدارة الفروع",
        branches_desc: "أضف فروع نشاطك التجاري أو مقرات عملك",
        add_branch_heading: "إضافة فرع جديد",
        btn_save_branch: "حفظ الفرع",
        qrcode_title: "مولد رمز الـ QR الذكي",
        qrcode_desc: "أنشئ رمز استجابة سريع لصفحتك، أو لأي رابط، أو لتسجيل الدخول السريع لشبكة واي فاي",
        qr_settings_heading: "تخصيص محتوى الـ QR",
        qr_type_lbl: "نوع المحتوى",
        qr_opt_profile: "رابط صفحتي الشخصية العامة",
        qr_opt_custom: "رابط مخصص آخر",
        qr_opt_wifi: "الاتصال بشبكة واي فاي (Wi-Fi)",
        qr_custom_lbl: "أدخل الرابط أو النص",
        wifi_ssid_lbl: "اسم شبكة الواي فاي (SSID)",
        wifi_pass_lbl: "كلمة المرور",
        wifi_enc_lbl: "نوع التشفير",
        btn_gen_qr: "توليد الـ QR",
        qr_preview_title: "معاينة الكود",
        dl_image: "تحميل كصورة (PNG)",
        dl_pdf: "تحميل كملف PDF",
        settings_title: "إعدادات الحساب والصفحة",
        settings_desc: "تحكم بكافة تفاصيل هويتك وعرض صفحاتك وترتيب روابطك",
        sec_identity: "معلومات الحساب والهوية",
        display_name_lbl: "الاسم الظاهري",
        username_lbl: "اسم المستخدم (الرابط)",
        avatar_lbl: "صورة الحساب / الشعار (صورة البروفايل العام)",
        sec_bio: "النبذة الترحيبية (Bio) - إجباري",
        bio_ar_lbl: "النبذة بالعربية (إجباري)",
        bio_en_lbl: "النبذة بالإنجليزية (إجباري)",
        sec_visibility: "إظهار أو إخفاء التصنيفات في الصفحة العامة",
        chk_links: "تبويب الروابط",
        chk_store: "تبويب المتجر",
        chk_branches: "تبويب الفروع",
        sec_ordering: "تفضيلات ترتيب ظهور الروابط",
        ordering_desc: "اختر أيهما يظهر أولاً في صفحتك العامة لزيادة التفاعل:",
        order_first_lbl: "الرابط الأول في الترتيب",
        order_second_lbl: "الرابط الثاني في الترتيب",
        opt_social: "منصات التواصل الاجتماعي",
        opt_custom_links: "الروابط العامة الإضافية",
        opt_store: "المتجر الخفيف",
        opt_branches: "الفروع",
        btn_save: "حفظ جميع التغييرات",
        modal_qr_title: "تصدير وتحميل الكود",
        modal_qr_desc: "اختر صيغة التحميل المناسبة لجهازك (لا يتم حفظ أي بيانات على الخادم):",
        dl_png_btn: "صورة PNG",
        dl_pdf_btn: "ملف PDF",
        cancel: "إلغاء"
    },
    en: {
        page_title: "Keymerv | Dashboard",
        tab_links: "Links",
        tab_store: "Lite Store",
        tab_branches: "Branches",
        tab_qrcode: "QR Code",
        tab_settings: "Settings",
        logout: "Sign Out",
        links_title: "Links & Platforms Management",
        links_desc: "Add your links and 30 organized platforms with professional icons",
        add_link_heading: "Add Extra General Link",
        btn_add_link: "Add General Link",
        btn_save_social: "Save All Platforms",
        cat_social: "Essential Social Media",
        cat_media: "Streaming & Entertainment",
        cat_dev: "Communities, Dev & Business",
        cat_extra: "Additional Platforms",
        store_title: "Lite Store",
        store_desc: "Showcase your digital or physical products modernly",
        badge_soon: "Coming Soon",
        store_coming_title: "Lite Store Feature is Coming Soon",
        store_coming_desc: "We are currently developing a seamless sales system allowing your clients to buy directly from your public page.",
        btn_coming_soon: "Add Product (Soon)",
        branches_title: "Manage Branches",
        branches_desc: "Add your business branches or office locations",
        add_branch_heading: "Add New Branch",
        btn_save_branch: "Save Branch",
        qrcode_title: "Smart QR Code Generator",
        qrcode_desc: "Generate custom QR codes for your profile, custom links, or Wi-Fi login",
        qr_settings_heading: "Customize QR Content",
        qr_type_lbl: "Content Type",
        qr_opt_profile: "My Public Profile URL",
        qr_opt_custom: "Other Custom URL",
        qr_opt_wifi: "Wi-Fi Network Connection",
        qr_custom_lbl: "Enter URL or Text",
        wifi_ssid_lbl: "Wi-Fi Network Name (SSID)",
        wifi_pass_lbl: "Password",
        wifi_enc_lbl: "Encryption Type",
        btn_gen_qr: "Generate QR",
        qr_preview_title: "QR Preview",
        dl_image: "Download as Image (PNG)",
        dl_pdf: "Download as PDF",
        settings_title: "Account & Page Settings",
        settings_desc: "Manage your identity, visibility preferences, and link ordering",
        sec_identity: "Identity & Account Info",
        display_name_lbl: "Display Name",
        username_lbl: "Username (URL slug)",
        avatar_lbl: "Account Avatar / Logo",
        sec_bio: "Bio - Required",
        bio_ar_lbl: "Arabic Bio (Required)",
        bio_en_lbl: "English Bio (Required)",
        sec_visibility: "Section Visibility on Public Page",
        chk_links: "Links Tab",
        chk_store: "Store Tab",
        chk_branches: "Branches Tab",
        sec_ordering: "Link Display Ordering Preferences",
        ordering_desc: "Choose which section appears first on your public page:",
        order_first_lbl: "First Section in Order",
        order_second_lbl: "Second Section in Order",
        opt_social: "Social Media Platforms",
        opt_custom_links: "Extra General Links",
        opt_store: "Lite Store",
        opt_branches: "Branches",
        btn_save: "Save All Changes",
        modal_qr_title: "Export & Download QR",
        modal_qr_desc: "Choose download format (No data is saved on the server):",
        dl_png_btn: "PNG Image",
        dl_pdf_btn: "PDF File",
        cancel: "Cancel"
    }
};

window.toggleDashboardLang = function() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('dashboard_lang', currentLang);
    applyLanguage();
};

function applyLanguage() {
    const html = document.getElementById('html-root');
    if (!html) return;
    html.setAttribute('lang', currentLang);
    html.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    const langBtn = document.getElementById('lang-btn-top');
    if (langBtn) langBtn.textContent = currentLang === 'ar' ? 'AR' : 'EN';
    
    const dict = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = dict.page_title;
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toast-message').textContent = msg;
    document.getElementById('toast-icon').innerHTML = type === 'success' ? '<i class="fa-solid fa-circle-check text-emerald-400"></i>' : '<i class="fa-solid fa-circle-exclamation text-rose-400"></i>';
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

window.switchTab = (tabId) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('bg-indigo-600', 'text-white', 'text-slate-200'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-white'));
    
    const sec = document.getElementById(`sec-${tabId}`);
    const btn = document.getElementById(`tab-btn-${tabId}`);
    if (sec) sec.classList.remove('hidden');
    if (btn) {
        btn.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
        btn.classList.add('bg-indigo-600', 'text-white');
    }
};

window.toggleAccordion = (id) => {
    const el = document.getElementById(id);
    const icon = document.getElementById(`icon-${id}`);
    if (el) el.classList.toggle('hidden');
    if (icon) icon.classList.toggle('rotate-180');
};

window.copyProfileUrl = () => {
    if (!currentProfile || !currentProfile.username) return;
    const fullUrl = `${window.location.origin}/profile.html?u=${currentProfile.username}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
        showToast(currentLang === 'ar' ? 'تم نسخ رابط البروفايل بنجاح!' : 'Profile link copied successfully!');
    });
};

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = "login.html"; return; }
    currentUser = session.user;

    const { data: profile } = await supabase.from('users_profiles').select('*').eq('id', currentUser.id).maybeSingle();
    currentProfile = profile || {};

    const displayNameEl = document.getElementById('user-display-name');
    const handleEl = document.getElementById('user-handle');
    const avatarEl = document.getElementById('user-avatar');
    const viewProfileEl = document.getElementById('view-live-profile');
    const qrUrlEl = document.getElementById('qr-profile-url');

    if (displayNameEl) displayNameEl.textContent = currentProfile.display_name || currentUser.email.split('@')[0];
    if (handleEl) handleEl.textContent = `@${currentProfile.username || 'user'}`;
    if (avatarEl) {
        if (currentProfile.avatar_url) {
            avatarEl.innerHTML = `<img src="${currentProfile.avatar_url}" class="w-full h-full object-cover">`;
        } else {
            avatarEl.textContent = (currentProfile.display_name || 'K')[0].toUpperCase();
        }
    }
    if (viewProfileEl) viewProfileEl.href = `profile.html?u=${currentProfile.username || ''}`;
    if (qrUrlEl) qrUrlEl.textContent = `${window.location.origin}/profile.html?u=${currentProfile.username || ''}`;

    // تعبئة حقول الإعدادات
    const settingsName = document.getElementById('settings-display-name');
    const settingsUser = document.getElementById('settings-username');
    const settingsBioAr = document.getElementById('settings-bio-ar');
    const settingsBioEn = document.getElementById('settings-bio-en');

    if (settingsName) settingsName.value = currentProfile.display_name || '';
    if (settingsUser) settingsUser.value = currentProfile.username || '';
    if (settingsBioAr) settingsBioAr.value = currentProfile.bio || '';
    if (settingsBioEn) settingsBioEn.value = currentProfile.bio_en || '';

    const chkLinks = document.getElementById('chk-show-links');
    const chkStore = document.getElementById('chk-show-store');
    const chkBranches = document.getElementById('chk-show-branches');

    if (chkLinks) chkLinks.checked = currentProfile.show_links ?? true;
    if (chkStore) chkStore.checked = currentProfile.show_store ?? true;
    if (chkBranches) chkBranches.checked = currentProfile.show_branches ?? true;

    const order1 = document.getElementById('settings-order-1');
    const order2 = document.getElementById('settings-order-2');
    if (order1) order1.value = currentProfile.order_1 || 'social';
    if (order2) order2.value = currentProfile.order_2 || 'custom_links';

    // تعبئة خانات المنصات الـ 30
    const socInputs = document.querySelectorAll('.soc-input');
    socInputs.forEach(input => {
        const key = input.id.replace('soc-', '');
        if (currentProfile[key]) input.value = currentProfile[key];
    });

    generateQrCode();
    applyLanguage();
    loadLinks();
    loadBranches();
}

// حفظ المنصات الـ 30
window.saveSocialAccounts = async function() {
    const socInputs = document.querySelectorAll('.soc-input');
    const dataObj = {};
    socInputs.forEach(input => {
        const key = input.id.replace('soc-', '');
        dataObj[key] = input.value.trim();
    });

    const { error } = await supabase.from('users_profiles').update(dataObj).eq('id', currentUser.id);
    if (error) showToast("خطأ أثناء حفظ المنصات", "error");
    else showToast(currentLang === 'ar' ? 'تم حفظ جميع المنصات بنجاح!' : 'All platforms saved successfully!');
};

// الروابط العامة الإضافية
window.loadLinks = async function() {
    const container = document.getElementById('links-list');
    if (!container) return;
    const { data: links } = await supabase.from('links').select('*').eq('user_id', currentUser.id);
    if (!links || links.length === 0) { 
        container.innerHTML = `<div class="text-center py-4 text-slate-500 text-xs" data-i18n="no_extra_links">لا توجد روابط عامة إضافية حالياً</div>`; 
        return; 
    }
    container.innerHTML = links.map(l => `
        <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-md">
            <div><h4 class="font-bold text-slate-200 text-sm">${l.title}</h4><a href="${l.url}" target="_blank" class="text-xs text-indigo-400 break-all" dir="ltr">${l.url}</a></div>
            <button onclick="deleteItem('links', '${l.id}')" class="text-red-400 hover:text-red-300 p-2"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
};

const formAddLink = document.getElementById('form-add-link');
if (formAddLink) {
    formAddLink.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('link-title').value;
        const url = document.getElementById('link-url').value;
        await supabase.from('links').insert([{ user_id: currentUser.id, title, url }]);
        e.target.reset();
        loadLinks();
        showToast(currentLang === 'ar' ? 'تمت إضافة الرابط بنجاح!' : 'Link added successfully!');
    });
}

// الفروع
window.loadBranches = async function() {
    const container = document.getElementById('branches-list');
    if (!container) return;
    const { data: branches } = await supabase.from('branches').select('*').eq('owner_id', currentUser.id);
    if (!branches || branches.length === 0) { 
        container.innerHTML = `<div class="text-center py-8 text-slate-500 text-xs">لا توجد فروع مضافة</div>`; 
        return; 
    }
    container.innerHTML = branches.map(b => `
        <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-md">
            <div><h4 class="font-bold text-slate-200 text-sm">${b.branch_name || b.name} <span class="text-xs text-indigo-400 font-normal">(${b.city})</span></h4></div>
            <button onclick="deleteItem('branches', '${b.id}')" class="text-red-400 hover:text-red-300 p-2"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
};

const formAddBranch = document.getElementById('form-add-branch');
if (formAddBranch) {
    formAddBranch.addEventListener('submit', async (e) => {
        e.preventDefault();
        await supabase.from('branches').insert([{ 
            owner_id: currentUser.id, 
            branch_name: document.getElementById('branch-name').value, 
            city: document.getElementById('branch-city').value,
            phone: document.getElementById('branch-phone').value,
            location_url: document.getElementById('branch-map-url').value 
        }]);
        e.target.reset();
        loadBranches();
        showToast(currentLang === 'ar' ? 'تم حفظ الفرع بنجاح!' : 'Branch saved successfully!');
    });
}

window.deleteItem = async (table, id) => {
    if (confirm(currentLang === 'ar' ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?")) {
        await supabase.from(table).delete().eq('id', id);
        if (table === 'links') loadLinks();
        if (table === 'branches') loadBranches();
        showToast(currentLang === 'ar' ? 'تم الحذف بنجاح!' : 'Deleted successfully!');
    }
};

// مولد الـ QR الذكي
window.toggleQrInputs = function() {
    const type = document.getElementById('qr-type-select').value;
    const customWrap = document.getElementById('qr-input-custom-wrap');
    const wifiWrap = document.getElementById('qr-input-wifi-wrap');
    if (!customWrap || !wifiWrap) return;

    customWrap.classList.add('hidden');
    wifiWrap.classList.add('hidden');

    if (type === 'custom') customWrap.classList.remove('hidden');
    if (type === 'wifi') wifiWrap.classList.remove('hidden');
};

window.generateQrCode = function() {
    const type = document.getElementById('qr-type-select').value;
    const canvasContainer = document.getElementById('qrcode-canvas');
    if (!canvasContainer || !window.QRCode) return;

    let textToEncode = `${window.location.origin}/profile.html?u=${currentProfile.username || 'user'}`;

    if (type === 'custom') {
        textToEncode = document.getElementById('qr-custom-text').value || textToEncode;
    } else if (type === 'wifi') {
        const ssid = document.getElementById('wifi-ssid').value;
        const pass = document.getElementById('wifi-pass').value;
        const enc = document.getElementById('wifi-enc').value;
        textToEncode = `WIFI:S:${ssid};T:${enc};P:${pass};;`;
    }

    canvasContainer.innerHTML = "";
    activeQrCodeInstance = new QRCode(canvasContainer, {
        text: textToEncode,
        width: 150,
        height: 150,
        colorDark: "#020617",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
};

// نظام التحميل والتصدير المنبثق (بدون حفظ على السيرفر)
window.openDownloadModal = function(format) {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.classList.remove('hidden');
};

window.closeDownloadModal = function() {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.classList.add('hidden');
};

window.downloadQrImage = function() {
    const qrCanvas = document.querySelector('#qrcode-canvas canvas');
    if (!qrCanvas) {
        showToast(currentLang === 'ar' ? 'الرجاء توليد الكود أولاً' : 'Please generate QR first', 'error');
        return;
    }
    const imageUri = qrCanvas.toDataURL("image/png");
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUri;
    downloadLink.download = `Keymerv-QR-${currentProfile.username || 'code'}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    closeDownloadModal();
    showToast(currentLang === 'ar' ? 'تم تحميل الكود كصورة بنجاح!' : 'QR image downloaded successfully!');
};

window.downloadQrPdf = async function() {
    const qrWrapper = document.getElementById('qrcode-wrapper');
    if (!qrWrapper || !window.html2canvas || !window.jspdf) {
        showToast(currentLang === 'ar' ? 'حدث خطأ في تحميل مكتبة الـ PDF' : 'PDF library error', 'error');
        return;
    }
    try {
        const canvas = await html2canvas(qrWrapper, { scale: 3 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        pdf.setFont("Tajawal", "normal");
        pdf.setFontSize(20);
        pdf.text("Keymerv Smart QR Code", 105, 30, { align: 'center' });
        pdf.setFontSize(12);
        pdf.text(`Profile: @${currentProfile.username || ''}`, 105, 40, { align: 'center' });
        
        const imgWidth = 60;
        const imgHeight = 60;
        pdf.addImage(imgData, 'PNG', (210 - imgWidth) / 2, 60, imgWidth, imgHeight);
        
        pdf.save(`Keymerv-QR-${currentProfile.username || 'code'}.pdf`);
        closeDownloadModal();
        showToast(currentLang === 'ar' ? 'تم تحميل ملف الـ PDF بنجاح!' : 'PDF downloaded successfully!');
    } catch (err) {
        showToast(currentLang === 'ar' ? 'فشل تصدير الـ PDF' : 'Failed to export PDF', 'error');
    }
};

// الإعدادات والحفظ
const formSettings = document.getElementById('form-settings');
if (formSettings) {
    formSettings.addEventListener('submit', async (e) => {
        e.preventDefault();

        // التحقق من إلزامية البايو بالعربي والانجليزي
        const bioAr = document.getElementById('settings-bio-ar').value.trim();
        const bioEn = document.getElementById('settings-bio-en').value.trim();
        if (!bioAr || !bioEn) {
            showToast(currentLang === 'ar' ? 'يرجى إدخال النبذة بالعربية والإنجليزية إجبارياً' : 'Arabic and English bio are required', 'error');
            return;
        }

        const avatarFile = document.getElementById('settings-avatar-file').files[0];
        let avatarUrl = currentProfile.avatar_url || '';
        if (avatarFile) {
            const filePath = `avatars/${currentUser.id}-${Date.now()}.${avatarFile.name.split('.').pop()}`;
            await supabase.storage.from('uploads').upload(filePath, avatarFile);
            avatarUrl = supabase.storage.from('uploads').getPublicUrl(filePath).data.publicUrl;
        }

        const show_links = document.getElementById('chk-show-links').checked;
        const show_store = document.getElementById('chk-show-store').checked;
        const show_branches = document.getElementById('chk-show-branches').checked;
        const order_1 = document.getElementById('settings-order-1').value;
        const order_2 = document.getElementById('settings-order-2').value;

        const { error } = await supabase.from('users_profiles').update({
            display_name: document.getElementById('settings-display-name').value,
            username: document.getElementById('settings-username').value.trim().toLowerCase(),
            bio: bioAr,
            bio_en: bioEn,
            avatar_url: avatarUrl,
            show_links, show_store, show_branches,
            order_1, order_2
        }).eq('id', currentUser.id);

        if (error) showToast("خطأ: " + error.message, "error");
        else { 
            showToast(currentLang === 'ar' ? 'تم حفظ كافة الإعدادات بنجاح!' : 'All settings saved successfully!'); 
            setTimeout(() => location.reload(), 1000); 
        }
    });
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = "login.html";
    });
}

checkAuth();
