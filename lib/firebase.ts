import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhKyS4pnUz6FOhfD7d4tgdTdMrmxZhJBs",
  authDomain: "dapurminul-6f6fa.firebaseapp.com",
  projectId: "dapurminul-6f6fa",
  storageBucket: "dapurminul-6f6fa.appspot.com",
  messagingSenderId: "575156385590",
  appId: "1:575156385590:web:4d651a7788bdfc4398a597"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);