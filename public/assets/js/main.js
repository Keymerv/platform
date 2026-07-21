import { supabase } from './supabase-config.js';

let currentUser = null;
let currentProfile = null;
let currentLang = localStorage.getItem('dashboard_lang') || 'ar';
let selectedQrStyle = 'basic';

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
        links_desc: "أضف روابطك ومنصاتك الـ 30 لتظهر بأيقوناتها الاحترافية",
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
        qrcode_desc: "أنشئ رمز استجابة سريع مع إطارات وتصاميم مميزة وبصمة Keymerv",
        qr_settings_heading: "تخصيص محتوى الـ QR",
        qr_type_lbl: "نوع المحتوى",
        qr_opt_profile: "رابط صفحتي الشخصية العامة",
        qr_opt_custom: "رابط مخصص آخر",
        qr_opt_wifi: "الاتصال بشبكة واي فاي (Wi-Fi)",
        qr_custom_lbl: "أدخل الرابط أو النص",
        wifi_ssid_lbl: "اسم شبكة الواي فاي (SSID)",
        wifi_pass_lbl: "كلمة المرور",
        wifi_enc_lbl: "نوع التشفير",
        btn_gen_qr_popup: "توليد واختيار تصميم الكود",
        settings_title: "إعدادات الحساب والصفحة",
        settings_desc: "تحكم بكافة تفاصيل هويتك وعرض صفحاتك",
        sec_identity: "معلومات الحساب والهوية",
        display_name_lbl: "الاسم الظاهري",
        username_lbl: "اسم المستخدم (لا يمكن تعديله)",
        avatar_lbl: "صورة الحساب / الشعار",
        sec_bio: "النبذة الترحيبية (Bio) - إجباري",
        bio_ar_lbl: "النبذة بالعربية (إجباري)",
        bio_en_lbl: "النبذة بالإنجليزية (إجباري)",
        sec_visibility: "إظهار أو إخفاء التصنيفات في الصفحة العامة",
        chk_links: "تبويب الروابط",
        chk_store: "تبويب المتجر",
        chk_branches: "تبويب الفروع",
        btn_save: "حفظ جميع التغييرات",
        modal_qr_title: "اختر تصميم الـ QR المناسب",
        modal_qr_desc: "يحتوي الكود تلقائياً على بصمة 'Created by Keymerv':",
        style_basic: "عادي (بيسك)",
        style_luxury: "فخم بإطار",
        style_glitch: "عصري مدوش",
        dl_png_btn: "تحميل كصورة (PNG)",
        dl_pdf_btn: "تحميل كملف PDF"
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
        qrcode_desc: "Generate custom QR codes with frames and Keymerv watermark",
        qr_settings_heading: "Customize QR Content",
        qr_type_lbl: "Content Type",
        qr_opt_profile: "My Public Profile URL",
        qr_opt_custom: "Other Custom URL",
        qr_opt_wifi: "Wi-Fi Network Connection",
        qr_custom_lbl: "Enter URL or Text",
        wifi_ssid_lbl: "Wi-Fi Network Name (SSID)",
        wifi_pass_lbl: "Password",
        wifi_enc_lbl: "Encryption Type",
        btn_gen_qr_popup: "Generate & Choose QR Design",
        settings_title: "Account & Page Settings",
        settings_desc: "Manage your identity and visibility preferences",
        sec_identity: "Identity & Account Info",
        display_name_lbl: "Display Name",
        username_lbl: "Username (Read-only)",
        avatar_lbl: "Account Avatar / Logo",
        sec_bio: "Bio - Required",
        bio_ar_lbl: "Arabic Bio (Required)",
        bio_en_lbl: "English Bio (Required)",
        sec_visibility: "Section Visibility on Public Page",
        chk_links: "Links Tab",
        chk_store: "Store Tab",
        chk_branches: "Branches Tab",
        btn_save: "Save All Changes",
        modal_qr_title: "Choose QR Design Style",
        modal_qr_desc: "Includes 'Created by Keymerv' watermark automatically:",
        style_basic: "Basic",
        style_luxury: "Luxury Frame",
        style_glitch: "Modern Glitch",
        dl_png_btn: "PNG Image",
        dl_pdf_btn: "PDF File"
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
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('bg-indigo-600', 'text-white'));
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
    const fullUrl = `${window.location.origin}/platform/public/profile.html?u=${currentProfile.username}`;
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

    const settingsName = document.getElementById('settings-display-name');
    const settingsUser = document.getElementById('settings-username');
    const settingsBioAr = document.getElementById('settings-bio-ar');
    const settingsBioEn = document.getElementById('settings-bio-en');

    if (settingsName) settingsName.value = currentProfile.display_name || '';
    if (settingsUser) {
        settingsUser.value = currentProfile.username || '';
        settingsUser.disabled = true;
    }
    if (settingsBioAr) settingsBioAr.value = currentProfile.bio || '';
    if (settingsBioEn) settingsBioEn.value = currentProfile.bio_en || '';

    const chkLinks = document.getElementById('chk-show-links');
    const chkStore = document.getElementById('chk-show-store');
    const chkBranches = document.getElementById('chk-show-branches');

    if (chkLinks) chkLinks.checked = currentProfile.show_links ?? true;
    if (chkStore) chkStore.checked = currentProfile.show_store ?? true;
    if (chkBranches) chkBranches.checked = currentProfile.show_branches ?? true;

    const socInputs = document.querySelectorAll('.soc-input');
    socInputs.forEach(input => {
        const key = input.id.replace('soc-', '');
        if (currentProfile[key]) input.value = currentProfile[key];
    });

    applyLanguage();
    loadLinks();
    loadBranches();
}

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

window.loadLinks = async function() {
    const container = document.getElementById('links-list');
    if (!container) return;
    const { data: links } = await supabase.from('links').select('*').eq('user_id', currentUser.id);
    if (!links || links.length === 0) { 
        container.innerHTML = `<div class="text-center py-4 text-slate-500 text-xs">لا توجد روابط عامة إضافية حالياً</div>`; 
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

window.openQrStyleModal = function() {
    const modal = document.getElementById('qr-style-modal');
    if (modal) modal.classList.remove('hidden');
    renderAllQrStyles();
};

window.closeQrStyleModal = function() {
    const modal = document.getElementById('qr-style-modal');
    if (modal) modal.classList.add('hidden');
};

function getQrTextToEncode() {
    const type = document.getElementById('qr-type-select').value;
    let textToEncode = `${window.location.origin}/profile.html?u=${currentProfile.username || 'user'}`;
    if (type === 'custom') {
        textToEncode = document.getElementById('qr-custom-text').value || textToEncode;
    } else if (type === 'wifi') {
        const ssid = document.getElementById('wifi-ssid').value;
        const pass = document.getElementById('wifi-pass').value;
        const enc = document.getElementById('wifi-enc').value;
        textToEncode = `WIFI:S:${ssid};T:${enc};P:${pass};;`;
    }
    return textToEncode;
}

function renderAllQrStyles() {
    const text = getQrTextToEncode();
    ['basic', 'luxury', 'glitch'].forEach(style => {
        const container = document.getElementById(`preview-${style}`);
        if (container) {
            container.innerHTML = "";
            new QRCode(container, {
                text: text,
                width: 110,
                height: 110,
                colorDark: style === 'luxury' ? "#1e1b4b" : style === 'glitch' ? "#581c87" : "#020617",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            setTimeout(() => {
                let watermark = container.querySelector('.keymerv-wm');
                if (!watermark) {
                    watermark = document.createElement('div');
                    watermark.className = 'keymerv-wm text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-1 text-center';
                    watermark.textContent = 'Created by Keymerv';
                    container.appendChild(watermark);
                }
            }, 50);
        }
    });
}

window.selectQrStyle = function(style) {
    selectedQrStyle = style;
    document.querySelectorAll('.qr-style-card').forEach(card => {
        card.classList.remove('border-indigo-600', 'border-2');
        card.classList.add('border-slate-800', 'border-2');
    });
    const activeCard = document.getElementById(`qr-card-${style}`);
    if (activeCard) {
        activeCard.classList.remove('border-slate-800');
        activeCard.classList.add('border-indigo-600');
    }
};

window.downloadSelectedQrImage = function() {
    const sourceCard = document.getElementById(`preview-${selectedQrStyle}`);
    if (!sourceCard || !window.html2canvas) {
        showToast('خطأ في توليد الصورة', 'error');
        return;
    }
    html2canvas(sourceCard, { scale: 3 }).then(canvas => {
        const imageUri = canvas.toDataURL("image/png");
        const a = document.createElement('a');
        a.href = imageUri;
        a.download = `Keymerv-QR-${selectedQrStyle}-${currentProfile.username || 'code'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        closeQrStyleModal();
        showToast(currentLang === 'ar' ? 'تم تحميل الكود كصورة بنجاح!' : 'QR image downloaded successfully!');
    });
};

window.downloadSelectedQrPdf = async function() {
    const sourceCard = document.getElementById(`preview-${selectedQrStyle}`);
    if (!sourceCard || !window.html2canvas || !window.jspdf) {
        showToast('خطأ في تحميل مكتبة الـ PDF', 'error');
        return;
    }
    try {
        const canvas = await html2canvas(sourceCard, { scale: 3 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        pdf.setFont("Tajawal", "normal");
        pdf.setFontSize(18);
        pdf.text("Keymerv Smart QR Code", 105, 30, { align: 'center' });
        pdf.setFontSize(10);
        pdf.text("Created by Keymerv", 105, 38, { align: 'center' });
        
        const imgWidth = 70;
        const imgHeight = 70;
        pdf.addImage(imgData, 'PNG', (210 - imgWidth) / 2, 55, imgWidth, imgHeight);
        
        pdf.save(`Keymerv-QR-${selectedQrStyle}-${currentProfile.username || 'code'}.pdf`);
        closeQrStyleModal();
        showToast(currentLang === 'ar' ? 'تم تحميل ملف الـ PDF بنجاح!' : 'PDF downloaded successfully!');
    } catch (err) {
        showToast('فشل تصدير الـ PDF', 'error');
    }
};

const formSettings = document.getElementById('form-settings');
if (formSettings) {
    formSettings.addEventListener('submit', async (e) => {
        e.preventDefault();
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

        const { error } = await supabase.from('users_profiles').update({
            display_name: document.getElementById('settings-display-name').value,
            bio: bioAr,
            bio_en: bioEn,
            avatar_url: avatarUrl,
            show_links, show_store, show_branches
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
