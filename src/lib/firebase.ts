import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Reuses an existing Firebase app instance across Next.js HMR reloads and SSR.
 */
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Shared Cloud Firestore instance.
 */
export const db = getFirestore(app);

let analyticsPromise: Promise<Analytics | null> | null = null;

/**
 * Lazily initializes Firebase Analytics only in supported browser environments.
 */
export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => (supported ? getAnalytics(app) : null))
      .catch(() => null);
  }

  return analyticsPromise;
}
