import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Re-using config from file
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testRead() {
    try {
        const querySnapshot = await getDocs(collection(db, "test"));
        console.log("Read successful!");
    } catch (e) {
        console.error("Read failed:", e);
    }
}
testRead();
