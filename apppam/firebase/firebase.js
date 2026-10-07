import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1XnYb_l6eFr2fRLPPzBaMTTl2WpgO2Dg",
  authDomain: "meuprojetofb-4191c.firebaseapp.com",
  projectId: "meuprojetofb-4191c",
  storageBucket: "meuprojetofb-4191c.firebasestorage.app",
  messagingSenderId: "477794317249",
  appId: "1:477794317249:web:6d0385ae6baadf8c4b3540",
  measurementId: "G-QZ4JJZCLNS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
