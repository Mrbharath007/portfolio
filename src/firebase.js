// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_LoY0eJBLq-S-aEYrfxPR5HIA6MiBkvA",
  authDomain: "portfolio-71498.firebaseapp.com",
  projectId: "portfolio-71498",
  storageBucket: "portfolio-71498.firebasestorage.app",
  messagingSenderId: "421380275361",
  appId: "1:421380275361:web:d972cbd85dce13ed8844e0",
  measurementId: "G-KMWC2DY685"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
