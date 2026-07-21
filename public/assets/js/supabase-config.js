// استيراد مكتبة Supabase عبر CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// بيانات الاتصال الخاصة بمشروعك
const SUPABASE_URL = 'https://nlbbgxazoiylneagusen.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3088Sqrhuz6CTI06GqCiuA_GIlWtFXz'; // <-- استبدلها بالرمز الكامل من الشاشة

// إنشاء عميل Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
