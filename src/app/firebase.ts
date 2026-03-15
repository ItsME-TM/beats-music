// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only on the client to avoid invoking browser-only
// APIs during server-side prerender/build (which causes auth/invalid-api-key
// and similar errors when env vars are missing or invalid in CI).
let app: ReturnType<typeof initializeApp> | undefined = undefined;
let authInstance: ReturnType<typeof getAuth> | undefined = undefined;
let googleProviderInstance: InstanceType<typeof GoogleAuthProvider> | undefined =
  undefined;

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    app = initializeApp(firebaseConfig);
    // analytics may throw in some environments; guard it
    try {
      getAnalytics(app);
    } catch {
      // ignore analytics errors (optional)
    }
    authInstance = getAuth(app);
    googleProviderInstance = new GoogleAuthProvider();
  } catch (err) {
    // If initialization fails on the client, log and continue; avoid
    // throwing during build/prerender where this module might be imported.
    // The client can surface auth errors at runtime.
    console.error("Firebase init failed:", err);
  }
}

export const auth = authInstance;
export const googleProvider = googleProviderInstance;
