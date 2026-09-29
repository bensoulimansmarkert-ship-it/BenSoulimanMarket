// BEN SOULIMAN MARKET — Firebase configuration placeholder
// أدخل إعدادات Firebase الحقيقية هنا عند بدء مرحلة الربط.
const FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};
function isFirebaseConfigured(){return Boolean(FIREBASE_CONFIG.apiKey&&FIREBASE_CONFIG.projectId&&FIREBASE_CONFIG.appId)}
function getFirebaseStatus(){return isFirebaseConfigured()?'configured':'not-configured'}
window.BenSuleimanFirebase={config:FIREBASE_CONFIG,isConfigured:isFirebaseConfigured,status:getFirebaseStatus};
