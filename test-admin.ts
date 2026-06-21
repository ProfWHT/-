import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

try {
  initializeApp({
    credential: applicationDefault(),
    projectId: "morrelganj-today"
  });
  console.log("Admin initialized.");
  const db = getFirestore("ai-studio-002b111e-62c8-4cc3-b324-3c798ba3698a");
  console.log("Firestore initialized.");
  db.collection('test').doc('connection').set({ test: 1 }).then(() => {
    console.log("Write success");
    process.exit(0);
  }).catch(e => {
    console.error("Write error", e);
    process.exit(1);
  });
} catch (err) {
  console.error("Admin init error", err);
}
