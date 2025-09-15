import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDMOK9DQmf3qmBbs9jWuPv6xnGOK8_a_SU",
  authDomain: "risultati-e86a4.firebaseapp.com",
  projectId: "risultati-e86a4",
  storageBucket: "risultati-e86a4.appspot.com",
  messagingSenderId: "510752676243",
  appId: "1:510752676243:web:457d7f88ff22d32d28b066",
  measurementId: "G-GFY8T9CMK8"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Autenticazione anonima
signInAnonymously(auth).then(() => {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('main-app').classList.remove('hidden');
  // Puoi aggiungere qui la logica dell'app che deve partire dopo la connessione
  // setupHistoryListener(); // esempio (implementalo secondo le tue funzioni)
}).catch((error) => {
  alert("Errore autenticazione Firebase!");
  console.error(error);
});

// Funzioni Firestore di esempio (adattale alle tue necessità)
export { db, auth, app };
// Usa db per collection, addDoc, onSnapshot, ecc. nel resto del tuo JS!