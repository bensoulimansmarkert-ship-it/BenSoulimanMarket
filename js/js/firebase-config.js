// =========================================================
// BEN SOULIMAN MARKET
// firebase-config.js
// المرحلة 1/4 — إعداد Firebase الأساسي
// =========================================================

/* ---------- إعدادات Firebase ---------- */

const FIREBASE_CONFIG = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

/* ---------- التحقق من إعداد Firebase ---------- */

function isFirebaseConfigured() {

    return Boolean(
        FIREBASE_CONFIG.apiKey &&
        FIREBASE_CONFIG.projectId &&
        FIREBASE_CONFIG.appId
    );
}

/* ---------- معرفة حالة Firebase ---------- */

function getFirebaseStatus() {

    if (isFirebaseConfigured()) {
        return "configured";
    }

    return "not-configured";
}

// =========================================================
// المرحلة 2/4 — حالة اتصال Firebase
// =========================================================

/* ---------- متغير تطبيق Firebase ---------- */

let firebaseApp = null;

/* ---------- التحقق من توفر Firebase ---------- */

function isFirebaseAvailable() {

    return (
        typeof firebase !== "undefined"
    );
}

/* ---------- تهيئة Firebase ---------- */

function initializeFirebase() {

    if (!isFirebaseConfigured()) {
        console.warn(
            "Firebase غير مُعد بعد."
        );

        return false;
    }

    if (!isFirebaseAvailable()) {
        console.warn(
            "Firebase SDK غير موجود في الصفحة."
        );

        return false;
    }

    try {

        if (
            typeof firebase.apps !== "undefined" &&
            firebase.apps.length > 0
        ) {
            firebaseApp = firebase.apps[0];
        } else {
            firebaseApp =
                firebase.initializeApp(
                    FIREBASE_CONFIG
                );
        }

        console.log(
            "تم تهيئة Firebase بنجاح."
        );

        return true;

    } catch (error) {

        console.error(
            "خطأ في تهيئة Firebase:",
            error
        );

        return false;
    }
}

// =========================================================
// المرحلة 3/4 — خدمات Firebase الأساسية
// =========================================================

/* ---------- الحصول على تطبيق Firebase ---------- */

function getFirebaseApp() {

    if (!firebaseApp) {
        initializeFirebase();
    }

    return firebaseApp;
}

/* ---------- الحصول على Firestore ---------- */

function getFirestore() {

    const app = getFirebaseApp();

    if (!app) {
        return null;
    }

    try {

        return firebase.firestore();

    } catch (error) {

        console.error(
            "تعذر الوصول إلى Firestore:",
            error
        );

        return null;
    }
}

/* ---------- الحصول على Firebase Authentication ---------- */

function getFirebaseAuth() {

    const app = getFirebaseApp();

    if (!app) {
        return null;
    }

    try {

        return firebase.auth();

    } catch (error) {

        console.error(
            "تعذر الوصول إلى Firebase Authentication:",
            error
        );

        return null;
    }
}

// =========================================================
// المرحلة 4/4 — تشغيل Firebase تلقائيًا
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- تهيئة Firebase ---------- */

    if (isFirebaseConfigured()) {

        const initialized =
            initializeFirebase();

        if (initialized) {

            console.log(
                "🔥 Ben Souliman Market — Firebase جاهز"
            );

        }

    } else {

        console.log(
            "ℹ️ Firebase غير مُعد حاليًا، وسيعمل النظام محليًا."
        );
    }

});
