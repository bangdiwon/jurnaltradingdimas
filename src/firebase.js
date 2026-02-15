import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Ini yang menghubungkan ke Database

// Kunci rahasia Firebase milikmu
const firebaseConfig = {
  apiKey: "AIzaSyCeOK6FFHSKtqh6E0VpY480yjS3U9G7pAg",
  authDomain: "jurnal-trading-8f0a4.firebaseapp.com",
  projectId: "jurnal-trading-8f0a4",
  storageBucket: "jurnal-trading-8f0a4.firebasestorage.app",
  messagingSenderId: "504918072017",
  appId: "1:504918072017:web:07778f0561a0f6db7943f0",
  measurementId: "G-156CPLD1BV",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore Database dan Export agar bisa digunakan oleh App.jsx
export const db = getFirestore(app);
