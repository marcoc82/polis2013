import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, getDocs, getDoc, query, where, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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

signInAnonymously(auth)
  .then(() => {
    if (typeof window.onFirebaseReady === 'function') {
      window.onFirebaseReady();
    } else {
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

window.saveGameToFirebase = async function(gameData) {
  try {
    // Pulisci l'oggetto rimuovendo i campi undefined, in particolare per i cartellini
    const cleanGameData = cleanDataForFirebase(gameData);
    await addDoc(collection(db, "partite"), cleanGameData);
  } catch (e) {
    alert("Errore salvataggio partita!");
    console.error(e);
  }
};

// Funzione per pulire i dati prima del salvataggio su Firebase
function cleanDataForFirebase(obj) {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanDataForFirebase(item)).filter(item => item !== null && item !== undefined);
  }
  
  if (typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = cleanDataForFirebase(value);
      if (cleanedValue !== null && cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }
  
  return obj;
}

window.deleteGameFromFirebase = async function(gameId) {
  try {
    await deleteDoc(doc(db, "partite", gameId));
    return { success: true };
  } catch (e) {
    console.error("Errore eliminazione partita:", e);
    throw new Error("Errore eliminazione partita: " + e.message);
  }
};

// Listener storico filtrato per società
window.setupHistoryListener = function(updateHistoryUI, societaId) {
  const historyRef = collection(db, "partite");
  let q;
  if (societaId) {
    q = query(historyRef, where("societaId", "==", societaId));
  } else {
    q = historyRef; // fallback: tutto lo storico
  }
  onSnapshot(q, (snapshot) => {
    const historyList = [];
    snapshot.forEach(doc => {
      historyList.push({ id: doc.id, ...doc.data() });
    });
    updateHistoryUI(historyList);
  });
};

// Verifica codice con array 'codici' - case-sensitive con logging per debug
window.verificaCodice = async function(codice) {
  try {
    // Log del codice inserito per debug
    console.log("🔍 Verifica codice - Input ricevuto:", {
      codice: codice,
      lunghezza: codice.length,
      hasSpacesInizio: codice !== codice.trimStart(),
      hasSpacesFine: codice !== codice.trimEnd(),
      codiceTrimmed: codice.trim()
    });

    // Controlla spazi iniziali/finali
    const hasLeadingSpaces = codice !== codice.trimStart();
    const hasTrailingSpaces = codice !== codice.trimEnd();
    
    if (hasLeadingSpaces || hasTrailingSpaces) {
      console.log("⚠️ Rilevati spazi iniziali/finali nel codice inserito");
    }

    const societaRef = collection(db, "societa");
    // Query case-sensitive esatta
    const q = query(societaRef, where("codici", "array-contains", codice));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const societaDoc = querySnapshot.docs[0];
      const societaData = societaDoc.data();
      
      // Log dei codici trovati per debug
      console.log("✅ Società trovata:", {
        societaId: societaDoc.id,
        nome: societaData.nome,
        codiciDisponibili: societaData.codici
      });
      
      return { 
        success: true, 
        societa: { 
          id: societaDoc.id, 
          ...societaData 
        } 
      };
    } else {
      // Cerchiamo tutte le società per vedere quali codici esistono (per debug)
      const allSocietaQuery = await getDocs(societaRef);
      const allCodici = [];
      
      allSocietaQuery.forEach(doc => {
        const data = doc.data();
        if (data.codici && Array.isArray(data.codici)) {
          allCodici.push(...data.codici.map(c => ({
            codice: c,
            societa: data.nome,
            esatto: c === codice,
            caseInsensitive: c.toLowerCase() === codice.toLowerCase()
          })));
        }
      });
      
      console.log("❌ Nessuna corrispondenza esatta trovata per:", codice);
      console.log("📋 Codici disponibili nel database:", allCodici);
      
      // Suggerisci possibili alternative
      const possibiliAlternative = allCodici.filter(item => item.caseInsensitive && !item.esatto);
      if (possibiliAlternative.length > 0) {
        console.log("💡 Possibili alternative (case different):", possibiliAlternative.map(a => a.codice));
      }
      
      let errorMessage = "Codice non trovato";
      
      // Migliora il messaggio di errore con suggerimenti
      if (hasLeadingSpaces || hasTrailingSpaces) {
        errorMessage = "Codice non valido. Controlla che non ci siano spazi all'inizio o alla fine.";
      } else if (possibiliAlternative.length > 0) {
        errorMessage = "Codice non valido. Controlla maiuscole/minuscole - il codice deve essere inserito esattamente come fornito.";
      } else {
        errorMessage = "Codice non trovato. Verifica di aver inserito il codice corretto, prestando attenzione a maiuscole/minuscole.";
      }
      
      return { success: false, message: errorMessage };
    }
  } catch (e) {
    console.error("Errore verifica codice:", e);
    return { success: false, message: "Errore di connessione" };
  }
};

window.aggiornaGiocatoriSocieta = async function(societaId, nuoviGiocatori, numPeriods = 2) {
  try {
    const societaRef = doc(db, "societa", societaId);
    await updateDoc(societaRef, {
      giocatori: nuoviGiocatori,
      numPeriods: numPeriods
    });
    return { success: true };
  } catch (e) {
    console.error("Errore aggiornamento giocatori:", e);
    return { success: false, message: "Errore di aggiornamento" };
  }
};

// Funzione per verificare la password di una società
window.verificaPasswordSocieta = async function(societaId, password) {
  try {
    const societaRef = doc(db, "societa", societaId);
    const societaDoc = await getDoc(societaRef);
    
    if (!societaDoc.exists()) {
      return { success: false, message: "Società non trovata" };
    }
    
    const societaData = societaDoc.data();
    
    // Verifica che esista l'array codici e che abbia almeno 2 elementi
    if (!societaData.codici || !Array.isArray(societaData.codici) || societaData.codici.length < 2) {
      return { success: false, message: "Password non configurata per questa società" };
    }
    
    // Confronta con array[1] (secondo elemento dell'array codici)
    const correctPassword = societaData.codici[1];
    
    if (password === correctPassword) {
      return { success: true };
    } else {
      return { success: false, message: "Password non corretta" };
    }
  } catch (e) {
    console.error("Errore verifica password società:", e);
    return { success: false, message: "Errore di connessione" };
  }
};

// Funzione per creare una società di esempio (facoltativo)
window.creaSocietaEsempio = async function() {
  try {
    const societaRef = collection(db, "societa");
    await addDoc(societaRef, {
      codici: ["Polis2013", "delete123"], // Codice case-sensitive esatto + password per eliminazione
      nome: "POLIS",
      numPeriods: 2, // Default to 2 periods
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
    console.log("Società esempio creata con codice case-sensitive: Polis2013");
  } catch (e) {
    console.error("Errore creazione società esempio:", e);
  }
};
