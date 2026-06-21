import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
const dbDefault = getFirestore(app);
const dbSpecific = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test(name: string, db: any) {
  try {
    await getDocs(collection(db, "users"));
    console.log(name, "SUCCESS");
  } catch (e: any) {
    console.error(name, "ERROR", e);
  }
}

async function run() {
  await test("Default", dbDefault);
  await test("Specific", dbSpecific);
  process.exit(0);
}

run();
