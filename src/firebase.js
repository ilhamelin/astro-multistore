import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLCRJJPEVpsZHmG7C2e0SOgdNe6DfGIcU",
  authDomain: "astro-multistore.firebaseapp.com",
  projectId: "astro-multistore",
  storageBucket: "astro-multistore.firebasestorage.app",
  messagingSenderId: "439353700473",
  appId: "1:439353700473:web:2cfdac9680271dd21124a8",
  measurementId: "G-MNPSGV91YF"
};

// Flag to indicate Firebase is configured
export const isFirebaseConfigured = true;

// Initialize Firebase (checking for duplicate app during Hot Module Replacement)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

