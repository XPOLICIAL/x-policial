import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";    

const firebaseConfig = {
  apiKey: "AIzaSyAD6Td3-892TD1iYujo7eDPOytwps_EaYc",
  authDomain: "x-policial.firebaseapp.com",
  projectId: "x-policial",
  storageBucket: "x-policial.firebasestorage.app",
  messagingSenderId: "74379312299",
  appId: "1:74379312299:web:b78524e559096cf82f4bee",
  measurementId: "G-XYRMEFMV62"
};

// Inicialitzem Firebase
const app = initializeApp(firebaseConfig);

// Exportem els serveis per a que la web els pugui fer servir
export const auth = getAuth(app);
export const db = getFirestore(app);       
export const storage = getStorage(app);
export default app;
