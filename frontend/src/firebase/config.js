import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAD6Td3-892TD1iYujo7eDPOytwps_EaYc",
  authDomain: "x-policial.firebaseapp.com",
  projectId: "x-policial",
  storageBucket: "x-policial.firebasestorage.app",
  messagingSenderId: "74379312299",
  appId: "1:74379312299:web:b78524e559096cf82f4bee",
  measurementId: "G-XYRMEFMV62"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
