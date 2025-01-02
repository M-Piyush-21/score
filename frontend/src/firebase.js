
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIkF_JfZ4FklOQg1m1ohJlqj4vQsQFMww",
  authDomain: "classroom-5e9c2.firebaseapp.com",
  projectId: "classroom-5e9c2",
  storageBucket: "classroom-5e9c2.firebasestorage.app",
  messagingSenderId: "1099120012083",
  appId: "1:1099120012083:web:4ae688c72d56ecf728ec46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
