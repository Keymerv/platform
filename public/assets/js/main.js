import { supabase } from './supabase-config.js';

let currentUser = null;
let currentProfile = null;
let currentLang = localStorage.getItem('dashboard_lang') || 'ar';

const translations = {
    ar: {
        page_title: "Keymerv | لوحة التحكم",
        tab_social: "السوشيال والروابط",
        tab_store: "المتجر الخفيف",
        tab_branches: "الفروع",
        tab_qrcode: "مولد الـ QR",
        tab_settings: "الإعدادات",
        logout: "تسجيل الخروج",
        social_title: "حسابات السوشيال ميديا والروابط",
        social_desc: "أضف روابط حساباتك ومنصاتك الـ 20 لتظهر بأيقوناتها الاحترافية",
        btn_save_social: "حفظ حسابات السوشيال",
        add_link_heading: "إضافة رابط عام إضافي",
        btn_add_link: "إضافة الرابط",
        store_title: "المتجر المصغر",
        add_prod_heading: "إضافة منتج جديد",
        btn_add_prod: "إضافة المنتج",
        branches_title: "إدارة الفروع",
        add_branch_heading: "إضافة فرع جديد",
        btn_save_branch: "حفظ الفرع",
        qrcode_title: "رمز الـ QR",
        copy_url: "نسخ الرابط",
        settings_title: "إعدادات الحساب والصفحة",
        display_name_lbl: "الاسم الظاهري",
        username_lbl: "اسم المستخدم",
        bio_heading: "النبذة الترحيبية (Bio)",
        bio_warning: "يرجى كتابة النبذة بالعربي والانجليزي",
        bio_ar_lbl: "النبذة بالعربية",
        bio_en_lbl: "النبذة بالإنجليزية",
        tabs_vis_heading: "إظهار أو إخفاء التبويبات",
        chk_links: "إظهار تبويب الروابط والسوشيال",
        chk_store: "إظهار تبويب المتجر",
        chk_branches: "إظهار تبويب الفروع",
        btn_save: "حفظ التغييرات"
    },
    en: {
        page_title: "Keymerv | Dashboard",
        tab_social: "Social & Links",
        tab_store: "Lite Store",
        tab_branches: "Branches",
        tab_qrcode: "QR Code",
        tab_settings: "Settings",
        logout: "Sign Out",
        social_title: "Social Media & Links",
        social_desc: "Add your 20 social accounts with professional icons",
        btn_save_social: "Save Social Accounts",
        add_link_heading: "Add Extra General Link",
        btn_add_link: "Add Link",
        store_title: "Lite Store",
        add_prod_heading: "Add New Product",
        btn_add_prod: "Add Product",
        branches_title: "Manage Branches",
        add_branch_heading: "Add New Branch",
        btn_save_branch: "Save Branch",
        qrcode_title: "QR Code",
        copy_url: "Copy URL",
        settings_title: "Account & Page Settings",
        display_name_lbl: "Display Name",
        username_lbl: "Username",
        bio_heading: "Bio",
        bio_warning: "Please write bio in Arabic and English",
        bio_ar_lbl: "Arabic Bio",
        bio_en_lbl: "English Bio",
        tabs_vis_heading: "Show or Hide Tabs",
        chk_links: "Show Social & Links Tab",
        chk_store: "Show Store Tab",
        chk_branches: "Show Branches Tab",
        btn_save: "Save Changes"
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
    const sec = document.getElementById(`sec-${tabId}`);
    const btn = document.getElementById(`tab-btn-${tabId}`);
    if (sec) sec.classList.remove('hidden');
    if (btn) btn.classList.add('bg-indigo-600', 'text-white');
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
    if (avatarEl) avatarEl.textContent = (currentProfile.display_name || 'K')[0].toUpperCase();
    if (viewProfileEl) viewProfileEl.href = `profile.html?u=${currentProfile.username}`;
    if (qrUrlEl) qrUrlEl.textContent = `${window.location.origin}/profile.html?u=${currentProfile.username}`;

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

    const socList = ['x', 'instagram', 'snapchat', 'tiktok', 'linkedin', 'spotify', 'jaco', 'telegram', 'youtube', 'facebook', 'whatsapp', 'reddit', 'discord', 'pinterest', 'twitch', 'github', 'patreon', 'substack', 'threads', 'medium'];
    socList.forEach(soc => {
        const el = document.getElementById(`soc-${soc}`);
        if (el && currentProfile[soc]) el.value = currentProfile[soc];
    });

    const qrContainer = document.getElementById('qrcode-canvas');
    if (qrContainer && window.QRCode) {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, { text: `${window.location.origin}/profile.html?u=${currentProfile.username}`, width: 160, height: 160 });
    }

    applyLanguage();
    loadLinks();
    loadProducts();
    loadBranches();
}

// حفظ السوشيال
const formSocial = document.getElementById('form-social');
if (formSocial) {
    formSocial.addEventListener('submit', async (e) => {
        e.preventDefault();
        const socList = ['x', 'instagram', 'snapchat', 'tiktok', 'linkedin', 'spotify', 'jaco', 'telegram', 'youtube', 'facebook', 'whatsapp', 'reddit', 'discord', 'pinterest', 'twitch', 'github', 'patreon', 'substack', 'threads', 'medium'];
        const dataObj = {};
        socList.forEach(soc => {
            const field = document.getElementById(`soc-${soc}`);
            if (field) dataObj[soc] = field.value;
        });

        const { error } = await supabase.from('users_profiles').update(dataObj).eq('id', currentUser.id);
        if (error) showToast("خطأ أثناء الحفظ", "error");
        else showToast("تم حفظ حسابات السوشيال بنجاح!");
    });
}

// الروابط
window.loadLinks = async function() {
    const container = document.getElementById('links-list');
    if (!container) return;
    const { data: links } = await supabase.from('links').select('*').eq('user_id', currentUser.id);
    if (!links || links.length === 0) { container.innerHTML = `<div class="text-center py-4 text-slate-500">لا توجد روابط إضافية</div>`; return; }
    container.innerHTML = links.map(l => `
        <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
            <div><h4 class="font-bold text-slate-200">${l.title}</h4><a href="${l.url}" target="_blank" class="text-xs text-indigo-400" dir="ltr">${l.url}</a></div>
            <button onclick="deleteItem('links', '${l.id}')" class="text-red-400 p-2"><i class="fa-solid fa-trash"></i></button>
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
        showToast("تمت الإضافة بنجاح!");
    });
}

// المنتجات
window.loadProducts = async function() {
    const container = document.getElementById('products-list');
    if (!container) return;
    const { data: products } = await supabase.from('products').select('*').eq('user_id', currentUser.id);
    if (!products || products.length === 0) { container.innerHTML = `<div class="text-center py-8 text-slate-500 col-span-2">لا توجد منتجات</div>`; return; }
    container.innerHTML = products.map(p => `
        <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            ${p.image_url ? `<img src="${p.image_url}" class="w-16 h-16 rounded-xl object-cover shrink-0">` : ''}
            <div class="flex-grow"><h4 class="font-bold text-slate-200">${p.title}</h4><span class="text-xs text-indigo-400 font-bold">${p.price} ر.س</span></div>
            <button onclick="deleteItem('products', '${p.id}')" class="text-red-400 p-2"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
};

const formAddProduct = document.getElementById('form-add-product');
if (formAddProduct) {
    formAddProduct.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imageFile = document.getElementById('prod-image').files[0];
        let imageUrl = '';
        if (imageFile) {
            const filePath = `products/${currentUser.id}-${Date.now()}.${imageFile.name.split('.').pop()}`;
            await supabase.storage.from('uploads').upload(filePath, imageFile);
            imageUrl = supabase.storage.from('uploads').getPublicUrl(filePath).data.publicUrl;
        }
        await supabase.from('products').insert([{ 
            user_id: currentUser.id, 
            title: document.getElementById('prod-title').value, 
            price: parseFloat(document.getElementById('prod-price').value), 
            description: document.getElementById('prod-desc').value, 
            image_url: imageUrl 
        }]);
        e.target.reset();
        loadProducts();
        showToast("تمت إضافة المنتج!");
    });
}

// الفروع
window.loadBranches = async function() {
    const container = document.getElementById('branches-list');
    if (!container) return;
    const { data: branches } = await supabase.from('branches').select('*').eq('owner_id', currentUser.id);
    if (!branches || branches.length === 0) { container.innerHTML = `<div class="text-center py-8 text-slate-500">لا توجد فروع</div>`; return; }
    container.innerHTML = branches.map(b => `
        <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
            <div><h4 class="font-bold text-slate-200">${b.branch_name || b.name} (${b.city})</h4></div>
            <button onclick="deleteItem('branches', '${b.id}')" class="text-red-400 p-2"><i class="fa-solid fa-trash"></i></button>
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
        showToast("تم حفظ الفرع!");
    });
}

window.deleteItem = async (table, id) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
        await supabase.from(table).delete().eq('id', id);
        if (table === 'links') loadLinks();
        if (table === 'products') loadProducts();
        if (table === 'branches') loadBranches();
        showToast("تم الحذف بنجاح!");
    }
};

// الإعدادات
const formSettings = document.getElementById('form-settings');
if (formSettings) {
    formSettings.addEventListener('submit', async (e) => {
        e.preventDefault();
        const show_links = document.getElementById('chk-show-links').checked;
        const show_store = document.getElementById('chk-show-store').checked;
        const show_branches = document.getElementById('chk-show-branches').checked;

        const { error } = await supabase.from('users_profiles').update({
            display_name: document.getElementById('settings-display-name').value,
            username: document.getElementById('settings-username').value.trim().toLowerCase(),
            bio: document.getElementById('settings-bio-ar').value,
            bio_en: document.getElementById('settings-bio-en').value,
            show_links, show_store, show_branches
        }).eq('id', currentUser.id);

        if (error) showToast("خطأ: " + error.message, "error");
        else { showToast("تم حفظ الإعدادات!"); setTimeout(() => location.reload(), 1000); }
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
