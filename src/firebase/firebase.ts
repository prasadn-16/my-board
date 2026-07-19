import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyC0dvxdz4zsOu0chXY-SSxBSEP2APEXGnY",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "myboard-267c6.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "myboard-267c6",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "myboard-267c6.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "99847324918",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:99847324918:web:ff72e482010aca84de18d7",
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-H723FJB9KP",
};

const app = initializeApp(firebaseConfig);

export const analytics = firebaseConfig.measurementId
  ? getAnalytics(app)
  : null;
export const auth = getAuth(app);