// استيراد الخدمات المطلوبة من Firebase SDK (الإصدار 10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// إعدادات فايربيز الخاصة بمشروعك
const firebaseConfig = {
    apiKey: "AIzaSyDmSIU_cUj1OYVxN7gmp20CTdhpTrjxCsg",
    authDomain: "keymerv-platform.firebaseapp.com",
    projectId: "keymerv-platform",
    storageBucket: "keymerv-platform.firebasestorage.app",
    messagingSenderId: "63907615583",
    appId: "1:63907615583:web:68609ae1a6b6a16bd09cea"
};

// تهيئة تطبيقات فايربيز
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// تصدير المتغيرات والأدوات للاستخدام المباشر في باقي الصفحات
export { 
    auth, 
    db, 
    googleProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    doc, 
    setDoc, 
    getDoc 
};
