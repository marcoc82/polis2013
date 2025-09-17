import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, getDocs, query, where, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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
    // Call the onFirebaseReady function if it exists
    if (typeof window.onFirebaseReady === 'function') {
      window.onFirebaseReady();
    } else {
      // Fallback: hide loading and show login screen
      document.getElementById('loading-screen').style.display = 'none';
      if (document.getElementById('login-screen')) {
        document.getElementById('login-screen').style.display = 'flex';
      }
    }
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

// Funzioni per gestione codici società e giocatori
window.verificaCodice = async function(codice) {
  try {
    const societaRef = collection(db, "societa");
    const q = query(societaRef, where("codice", "==", codice.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const societaDoc = querySnapshot.docs[0];
      return { 
        success: true, 
        societa: { 
          id: societaDoc.id, 
          ...societaDoc.data() 
        } 
      };
    } else {
      return { success: false, message: "Codice non valido" };
    }
  } catch (e) {
    console.error("Errore verifica codice:", e);
    return { success: false, message: "Errore di connessione" };
  }
};

window.aggiornaGiocatoriSocieta = async function(societaId, nuoviGiocatori) {
  try {
    const societaRef = doc(db, "societa", societaId);
    await updateDoc(societaRef, {
      giocatori: nuoviGiocatori
    });
    return { success: true };
  } catch (e) {
    console.error("Errore aggiornamento giocatori:", e);
    return { success: false, message: "Errore di aggiornamento" };
  }
};

// Funzione per creare una società di esempio (per testing)
window.creaSocietaEsempio = async function() {
  try {
    const societaRef = collection(db, "societa");
    await addDoc(societaRef, {
      codice: "POLIS2013",
      nome: "POLIS",
      giocatori: [
        "99 ALPA FEDERICO", "78 BECCARIS SEBASTIANO", "32 BEN MABROUK KEVIN", "23 BERLUSCONI NOAH",
        "1 BERNUCCI ROMEO", "18 BOERO GUGLIELMO", "22 BRIANO COSTANTINO", "28 CABASSI ROBERTO",
        "7 CALLIKU ANDREA", "4 CAZZULO MICHELE", "46 CONGIU ALESSIO", "20 DHAOUI OMAR",
        "5 DI DATO SIMONE", "77 DONALD BRYAN", "6 ESPOSITO EMANUELE", "25 GARDELLA ANDREA",
        "13 GENNARO EDOARDO", "91 GIOIA LEONARDO", "17 KHAY ADAM", "2 LAMKHAYAR AMIN",
        "29 LANNA MARK", "19 MARCHESE MATTEO", "47 MELLO CHRISTIAN", "61 MELLUSO MATTIA",
        "14 MONTEFIORI EDOARDO", "3 ODAGLIA ANDREA", "11 PELLICCI FRANCESCO", "90 PIGA GIOVANNI",
        "45 PINASCO ALESSANDRO", "10 POLLIO CESARE", "9 SCALA FEDERICO", "16 STANCHI FEDERICO",
        "21 TONINI LORENZO"
      ]
    });
    console.log("Società esempio creata con codice POLIS2013");
  } catch (e) {
    console.error("Errore creazione società esempio:", e);
  }
};
