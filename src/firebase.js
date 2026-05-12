import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrgSM23WukRepUeJlRgh5JZORxF6egxSk",
  authDomain: "gnosis-online.firebaseapp.com",
  projectId: "gnosis-online",
  storageBucket: "gnosis-online.firebasestorage.app",
  messagingSenderId: "181591707440",
  appId: "1:181591707440:web:a82801e649f15799f1c2f5",
  measurementId: "G-GVRP5494CH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();