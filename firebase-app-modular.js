import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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
      // Fallback: hide loading and show main app directly
      document.getElementById('loading-screen').style.display = 'none';
      if (document.getElementById('main-app')) {
        document.getElementById('main-app').classList.remove('hidden');
      }
    }
  })
  .catch((error) => {
    alert("Errore autenticazione Firebase!");
    console.error(error);
  });

// Firebase functions for match history
window.saveGameToFirebase = async function(gameData) {
  try {
    const docRef = await addDoc(collection(db, "partite"), gameData);
    console.log("Match saved to Firebase with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error saving match to Firebase: ", e);
    throw e;
  }
};

window.deleteGameFromFirebase = async function(gameId) {
  try {
    await deleteDoc(doc(db, "partite", gameId));
    console.log("Match deleted from Firebase with ID: ", gameId);
  } catch (e) {
    console.error("Error deleting match from Firebase: ", e);
    throw e;
  }
};

// Load match history from Firebase
window.loadHistoryFromFirebase = async function() {
  try {
    const historyRef = collection(db, "partite");
    const snapshot = await getDocs(historyRef);
    const historyList = [];
    snapshot.forEach(doc => {
      historyList.push({ id: doc.id, ...doc.data() });
    });
    return historyList;
  } catch (e) {
    console.error("Error loading history from Firebase: ", e);
    return [];
  }
};

// Setup real-time listener for match history
window.setupHistoryListener = function(updateHistoryUI) {
  const historyRef = collection(db, "partite");
  return onSnapshot(historyRef, (snapshot) => {
    const historyList = [];
    snapshot.forEach(doc => {
      historyList.push({ id: doc.id, ...doc.data() });
    });
    updateHistoryUI(historyList);
  });
};
