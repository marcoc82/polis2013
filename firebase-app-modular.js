import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMOK9DQmf3qmBbs9jWuPv6xnGOK8_a_SU",
  authDomain: "risultati-e86a4.firebaseapp.com",
  projectId: "risultati-e86a4",
  storageBucket: "risultati-e86a4.appspot.com",
  messagingSenderId: "510752676243",
  appId: "1:510752676243:web:457d7f88ff22d32d28b066",
  measurementId: "G-GFY8T9CMK8"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Autenticazione anonima
signInAnonymously(auth)
  .then(() => {
    // Qui puoi nascondere la schermata di loading e avviare la logica della tua app
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-app').classList.remove('hidden');
  })
  .catch((error) => {
    alert("Errore autenticazione Firebase!");
    console.error(error);
  });

// Esempio: rendi le funzioni Firestore disponibili globalmente (window)
window.saveGameToFirebase = async function(gameData) {
  try {
    await addDoc(collection(db, "partite"), gameData);
  } catch (e) {
    alert("Errore salvataggio partita!");
    console.error(e);
  }
};

window.deleteGameFromFirebase = async function(gameId) {
  try {
    await deleteDoc(doc(db, "partite", gameId));
  } catch (e) {
    alert("Errore eliminazione partita!");
    console.error(e);
  }
};

// Esempio listener storico Firestore
window.setupHistoryListener = function(updateHistoryUI) {
  const historyRef = collection(db, "partite");
  onSnapshot(historyRef, (snapshot) => {
    const historyList = [];
    snapshot.forEach(doc => {
      historyList.push({ id: doc.id, ...doc.data() });
    });
    updateHistoryUI(historyList);
  });
};
