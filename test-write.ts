import { initializeApp } from "firebase/app";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
const dbSpecific = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    await setDoc(doc(dbSpecific, "test/connection"), { timestamp: new Date() });
    console.log("Write SUCCESS");
  } catch (e: any) {
    console.error("Write ERROR", e);
  }
  process.exit(0);
}

run();
