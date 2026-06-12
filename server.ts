import express from "express";
import path from "path";
import cors from "cors";
import multer from "multer";
import { put } from "@vercel/blob";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

// Temporary in-memory storage, DB file initialization removed for Vercel
const users: any[] = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' }
];
const students: any[] = [];
const admissions: any[] = [];
const donations: any[] = [];
const donors: any[] = [];
const gallery: any[] = [];
const teachers: any[] = [];
const settings: Record<string, string> = {
  header_text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم',
  phone_number: '01824141497, 01633930308',
  address: 'তাফসীরুল কুরআন মাদ্রাসা, মুসলিম নগর, বুড়িরডাঙ্গা, দিগরাজ, মোংলা, বাগেরহাট',
  director_name: 'হাফেজ মাওলানা ফেরদাউস হোসাইন মাহমুদী',
  director_title: 'পরিচালক',
  teachers_count: '0',
  notice_text: 'আসসালামু আলাইকুম, তাফসীরুল কুরআন মাদ্রাসায় নতুন সেশনে ভর্তি চলছে! আপনার অনুদান হোক সদকায়ে জারিয়া।'
};

// Initialize Firebase Firestore with local fallback using static json import
let firestoreDb: any = null;
try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    const fApp = initializeApp(firebaseConfig);
    firestoreDb = getFirestore(fApp, firebaseConfig.firestoreDatabaseId);
    console.log("Firestore initialized successfully!");
  }
} catch (err) {
  console.error("Firestore init error, fallback to memory:", err);
}

function syncToFirestore(collectionName: string, id: string | number, data: any | null) {
  if (!firestoreDb) return;
  const docRef = doc(firestoreDb, collectionName, String(id));
  if (data === null) {
    deleteDoc(docRef).catch(err => console.error("Firestore delete error:", err));
  } else {
    const sanitized: any = {};
    for (const key of Object.keys(data)) {
      if (data[key] !== undefined) {
        sanitized[key] = data[key];
      }
    }
    setDoc(docRef, sanitized).catch(err => console.error("Firestore set error:", err));
  }
}

async function loadFromFirestore() {
  if (!firestoreDb) return;
  const collectionsToLoad = [
    { name: "users", list: users },
    { name: "students", list: students },
    { name: "teachers", list: teachers },
    { name: "admissions", list: admissions },
    { name: "donations", list: donations },
    { name: "donors", list: donors },
    { name: "gallery", list: gallery },
  ];

  for (const coll of collectionsToLoad) {
    try {
      const snap = await getDocs(collection(firestoreDb, coll.name));
      if (!snap.empty) {
        coll.list.length = 0;
        snap.forEach(docSnap => {
          const data = docSnap.data();
          coll.list.push({ ...data, id: String(docSnap.id) });
        });
      }
    } catch (err) {
      console.error(`Failed to load ${coll.name} from Firestore:`, err);
    }
  }

  try {
    const settingsSnap = await getDocs(collection(firestoreDb, "settings"));
    if (!settingsSnap.empty) {
      settingsSnap.forEach(docSnap => {
        const data = docSnap.data();
        if (data.value !== undefined) {
          settings[docSnap.id] = data.value;
        }
      });
    }
  } catch (err) {
    console.error("Failed to load settings from Firestore:", err);
  }

  if (users.length === 0) {
    users.push({ id: "1", username: "admin", password: "admin123", role: "admin" });
  }
}

// Database mock functions
const db = {
    prepare: (query: string) => {
        const q = query.trim().toLowerCase();
        return {
            get: (...args: any[]): any => {
                // Users checks
                if (q.includes("from users") && q.includes("username = ?") && q.includes("password = ?")) {
                    const [username, password] = args;
                    return users.find(u => u.username === username && u.password === password) || null;
                }
                
                // Teachers checks
                if (q.includes("from teachers") && q.includes("username = ?") && q.includes("password = ?")) {
                    const [username, password] = args;
                    return teachers.find(t => t.username === username && t.password === password) || null;
                }

                // Students check
                if (q.includes("from students") && q.includes("roll_number = ?") && q.includes("password = ?")) {
                    const [roll, pass] = args;
                    return students.find(s => s.roll_number == roll && s.password === pass) || null;
                }
                
                if (q.includes("from students") && q.includes("id = ?")) {
                    const [id] = args;
                    return students.find(s => s.id == id) || null;
                }

                // Count operations
                if (q.includes("count(*)") && q.includes("from students")) {
                    const count = students.filter(s => s.status !== 'completed').length;
                    return { count };
                }

                if (q.includes("count(*)") && q.includes("from admissions")) {
                    const count = admissions.filter(a => a.status === 'pending').length;
                    return { count };
                }

                if (q.includes("sum(amount)") && q.includes("from donations")) {
                    const total = donations.filter(d => d.status === 'received').reduce((sum, d) => sum + Number(d.amount), 0);
                    return { total };
                }

                if (q.includes("count(*)") && q.includes("from teachers")) {
                    return { count: teachers.length };
                }

                // Donors check
                if (q.includes("from donors") && q.includes("name = ?")) {
                    const [name] = args;
                    return donors.find(d => d.name === name) || null;
                }

                return null;
            },
            
            all: (...args: any[]): any[] => {
                if (q.includes("from users")) {
                    return users.filter(u => u.role === 'admin');
                }
                if (q.includes("from students")) {
                    return students;
                }
                if (q.includes("from admissions")) {
                    return admissions;
                }
                if (q.includes("from donations")) {
                    return donations;
                }
                if (q.includes("from donors")) {
                    return donors;
                }
                if (q.includes("from teachers")) {
                    return teachers;
                }
                if (q.includes("from gallery")) {
                    return gallery;
                }
                if (q.includes("from settings")) {
                    return Object.entries(settings).map(([key, value]) => ({ key, value }));
                }
                return [];
            },

            run: (...args: any[]): any => {
                if (q.startsWith("insert into users")) {
                    const [username, password, role] = args;
                    const newUser = { id: users.length + 1, username, password, role: role || 'admin' };
                    users.push(newUser);
                    syncToFirestore("users", newUser.id, newUser);
                    return { changes: 1, lastInsertRowid: newUser.id };
                }
                
                if (q.startsWith("insert or replace into settings") || q.startsWith("replace into settings")) {
                    const [key, value] = args;
                    settings[key] = value;
                    syncToFirestore("settings", key, { value });
                    return { changes: 1, lastInsertRowid: 0 };
                }

                if (q.startsWith("update users set password")) {
                    const [newPassword, username, oldPassword] = args;
                    const userIdx = users.findIndex(u => u.username === username && u.password === oldPassword);
                    if (userIdx !== -1) {
                        users[userIdx].password = newPassword;
                        syncToFirestore("users", users[userIdx].id, users[userIdx]);
                        return { changes: 1, lastInsertRowid: 0 };
                    }
                    return { changes: 0, lastInsertRowid: 0 };
                }

                if (q.startsWith("insert into students")) {
                    const [name, roll_number, department, guardian_name, guardian_phone, address, status, class_name, academic_year, result, password, photo, fee_paid, fee_due] = args;
                    const newStudent = {
                        id: students.length + 1,
                        name, roll_number, department, guardian_name, guardian_phone, address, status, class_name, academic_year, result, password, photo, fee_paid, fee_due
                    };
                    students.push(newStudent);
                    syncToFirestore("students", newStudent.id, newStudent);
                    return { changes: 1, lastInsertRowid: newStudent.id };
                }

                if (q.startsWith("update students set")) {
                    const [name, roll_number, department, guardian_name, guardian_phone, address, status, class_name, academic_year, result, password, photo, fee_paid, fee_due, id] = args;
                    const idx = students.findIndex(s => s.id == id);
                    if (idx !== -1) {
                        students[idx] = {
                            ...students[idx],
                            name, roll_number, department, guardian_name, guardian_phone, address, status, class_name, academic_year, result, password, photo, fee_paid, fee_due
                        };
                        syncToFirestore("students", id, students[idx]);
                        return { changes: 1, lastInsertRowid: 0 };
                    }
                    return { changes: 0, lastInsertRowid: 0 };
                }

                if (q.startsWith("delete from students")) {
                    const [id] = args;
                    const idx = students.findIndex(s => s.id == id);
                    if (idx !== -1) {
                        students.splice(idx, 1);
                        syncToFirestore("students", id, null);
                        return { changes: 1, lastInsertRowid: 0 };
                    }
                    return { changes: 0, lastInsertRowid: 0 };
                }

                if (q.startsWith("insert into admissions")) {
                    const [student_name, dob, guardian_name, contact_number, department, payment_method, trx_id] = args;
                    const newAdm = {
                        id: admissions.length + 1,
                        student_name, dob, guardian_name, contact_number, department, payment_method, trx_id, status: 'pending'
                    };
                    admissions.push(newAdm);
                    syncToFirestore("admissions", newAdm.id, newAdm);
                    return { changes: 1, lastInsertRowid: newAdm.id };
                }

                if (q.startsWith("update admissions set status")) {
                    const [status, id] = args;
                    const idx = admissions.findIndex(a => a.id == id);
                    if (idx !== -1) {
                        admissions[idx].status = status;
                        syncToFirestore("admissions", id, admissions[idx]);
                        return { changes: 1, lastInsertRowid: 0 };
                    }
                    return { changes: 0, lastInsertRowid: 0 };
                }

                if (q.startsWith("delete from admissions")) {
                    const [id] = args;
                    const idx = admissions.findIndex(a => a.id == id);
                    if (idx !== -1) {
                        admissions.splice(idx, 1);
                        syncToFirestore("admissions", id, null);
                        return { changes: 1, lastInsertRowid: 0 };
                    }
                    return { changes: 0, lastInsertRowid: 0 };
                }

                if (q.startsWith("update donations set status")) {
                    const [status, id] = args;
                    const idx = donations.findIndex(d => d.id == id);
                    if (idx !== -1) {
                        const oldStatus = donations[idx].status;
                        donations[idx].status = status;
                        syncToFirestore("donations", id, donations[idx]);
                        
                        // Only add to donors when status gets approved/received!
                        if (status === 'received' && oldStatus !== 'received') {
                            const donorName = donations[idx].donor_name;
                            const amount = donations[idx].amount;
                            let donorIdx = donors.findIndex(dr => dr.name === donorName);
                            if (donorIdx !== -1) {
                                donors[donorIdx].total_donated = (donors[donorIdx].total_donated || 0) + Number(amount);
                                syncToFirestore("donors", donors[donorIdx].id, donors[donorIdx]);
                            } else {
                                const newDonor = {
                                    id: donors.length + 1,
                                    name: donorName,
                                    total_donated: Number(amount)
                                };
                                donors.push(newDonor);
                                syncToFirestore("donors", newDonor.id, newDonor);
                            }
                        }
                        return { changes: 1, lastInsertRowid: 0 };
                    }
                    return { changes: 0, lastInsertRowid: 0 };
                }

                if (q.startsWith("insert into donations")) {
                    const [donor_name, amount, donation_type, payment_method, trx_id, date] = args;
                    const newDonation = {
                        id: donations.length + 1,
                        donor_name, amount, donation_type, payment_method, trx_id, date, status: 'pending'
                    };
                    donations.push(newDonation);
                    syncToFirestore("donations", newDonation.id, newDonation);
                    return { changes: 1, lastInsertRowid: newDonation.id };
                }

                if (q.startsWith("update donors set total_donated")) {
                    const [amount, id] = args;
                    const idx = donors.findIndex(d => d.id == id);
                    if (idx !== -1) {
                        donors[idx].total_donated = (donors[idx].total_donated || 0) + Number(amount);
                        syncToFirestore("donors", id, donors[idx]);
                        return { changes: 1, lastInsertRowid: 0 };
                    }
                    return { changes: 0, lastInsertRowid: 0 };
                }

                if (q.startsWith("insert into donors")) {
                    const [name, photo, phone, address, total_donated] = args;
                    const newDonor = {
                        id: donors.length + 1,
                        name, photo, phone, address, total_donated
                    };
                    donors.push(newDonor);
                    syncToFirestore("donors", newDonor.id, newDonor);
                    return { changes: 1, lastInsertRowid: newDonor.id };
                }

                if (q.startsWith("insert into teachers")) {
                    const [name, title, photo, phone, username, password, has_admin_access] = args;
                    const newTeacher = {
                        id: teachers.length + 1,
                        name, title, photo, phone, username, password, has_admin_access
                    };
                    teachers.push(newTeacher);
                    syncToFirestore("teachers", newTeacher.id, newTeacher);
                    return { changes: 1, lastInsertRowid: newTeacher.id };
                }

                if (q.startsWith("update teachers set")) {
                    let updated = false;
                    let matchedId = null;
                    if (args.length === 8) {
                        const [name, title, photo, phone, username, password, has_admin_access, id] = args;
                        const idx = teachers.findIndex(t => t.id == id);
                        if (idx !== -1) {
                            teachers[idx] = { ...teachers[idx], name, title, photo, phone, username, password, has_admin_access };
                            updated = true;
                            matchedId = id;
                        }
                    } else {
                        const [name, title, photo, phone, username, has_admin_access, id] = args;
                        const idx = teachers.findIndex(t => t.id == id);
                        if (idx !== -1) {
                            teachers[idx] = { ...teachers[idx], name, title, photo, phone, username, has_admin_access };
                            updated = true;
                            matchedId = id;
                        }
                    }
                    if (updated && matchedId) {
                        const idx = teachers.findIndex(t => t.id == matchedId);
                        syncToFirestore("teachers", matchedId, teachers[idx]);
                    }
                    return { changes: updated ? 1 : 0, lastInsertRowid: 0 };
                }

                if (q.startsWith("delete from teachers")) {
                    const [id] = args;
                    const idx = teachers.findIndex(t => t.id == id);
                    if (idx !== -1) {
                        teachers.splice(idx, 1);
                        syncToFirestore("teachers", id, null);
                        return { changes: 1, lastInsertRowid: 0 };
                    }
                    return { changes: 0, lastInsertRowid: 0 };
                }

                if (q.startsWith("insert into gallery")) {
                    const [image, caption, date] = args;
                    const newImg = {
                        id: gallery.length + 1,
                        image, caption, date
                    };
                    gallery.push(newImg);
                    syncToFirestore("gallery", newImg.id, newImg);
                    return { changes: 1, lastInsertRowid: newImg.id };
                }

                if (q.startsWith("delete from gallery")) {
                    const [id] = args;
                    const idx = gallery.findIndex(g => g.id == id);
                    if (idx !== -1) {
                        gallery.splice(idx, 1);
                        syncToFirestore("gallery", id, null);
                        return { changes: 1, lastInsertRowid: 0 };
                    }
                    return { changes: 0, lastInsertRowid: 0 };
                }

                return { changes: 0, lastInsertRowid: 0 };
            }
        };
    },
    exec: (query: string) => {},
    transaction: (cb: any) => cb
};

async function startServer() {
  // Load initial data from Firebase Firestore
  await loadFromFirestore();

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  const upload = multer({ storage: multer.memoryStorage() });

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    try {
      const { url } = await put(req.file.originalname, req.file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      res.json({ url });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes
  
  // -- Admin Management API --
  app.get("/api/admins", (req, res) => {
    try {
      const admins = db.prepare("SELECT id, username, role FROM users WHERE role = 'admin'").all();
      res.json(admins);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admins", (req, res) => {
    const { username, password } = req.body;
    try {
      db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')").run(username, password);
      res.json({ status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admins/password", (req, res) => {
    // In a real app we'd get current admin ID from token
    const { oldPassword, newPassword } = req.body;
    const username = 'admin'; // simplified
    try {
        const stmt = db.prepare("UPDATE users SET password = ? WHERE username = ? AND password = ?");
        const info = stmt.run(newPassword, username, oldPassword);
        if (info.changes > 0) {
            res.json({ status: "success" });
        } else {
            res.status(400).json({ error: "Invalid old password" });
        }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // -- Profile API --
  app.get("/api/profile", (req, res) => {
      // simplified: assume 'admin'
      res.json({ username: 'admin' });
  });

  app.post("/api/profile", (req, res) => {
      // simplified: assume 'admin'
      res.json({ status: 'success' });
  });

  // -- Auth API --
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    try {
      let row = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
      
      if (!row) {
        const teacher = db.prepare("SELECT * FROM teachers WHERE username = ? AND password = ? AND has_admin_access = 1").get(username, password) as any;
        if (teacher) {
          row = { id: teacher.id, username: teacher.username, role: 'admin' };
        }
      }

      if (row) {
        res.json({ token: "mock-jwt-token-123", user: row });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  app.post("/api/auth/student/login", (req, res) => {
    const { roll_number, password } = req.body;
    try {
      const student = db.prepare("SELECT id, name, roll_number, department, class_name, academic_year, result, photo, fee_paid, fee_due, status FROM students WHERE roll_number = ? AND password = ?").get(roll_number, password);
      if (student) {
        res.json({ token: "student-jwt-" + student.id, student });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  app.get("/api/auth/student/me", (req, res) => {
    // In a real app we would verify JWT here. We'll use id from header for simplicity
    const id = req.headers['x-student-id'];
    try {
      if(!id) return res.status(401).json({error: "No auth"});
      const student = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
      if (student) {
        res.json({ student });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  // -- Dashboard API --
  app.get("/api/dashboard/stats", (req, res) => {
    try {
      const totalStudents = db.prepare("SELECT COUNT(*) as count FROM students WHERE status != 'completed'").get() as any;
      const totalAdmissions = db.prepare("SELECT COUNT(*) as count FROM admissions WHERE status = 'pending'").get() as any;
      const totalDonations = db.prepare("SELECT SUM(amount) as total FROM donations WHERE status = 'received'").get() as any;
      
      const teachersCount = db.prepare("SELECT COUNT(*) as count FROM teachers").get() as any;

      res.json({
        totalStudents: totalStudents.count,
        pendingAdmissions: totalAdmissions.count,
        totalDonations: totalDonations.total || 0,
        totalTeachers: teachersCount.count || 0
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // -- Settings API --
  app.get("/api/settings", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM settings").all() as any[];
      const settingsMap = {
        ...settings,
        ...rows.reduce((acc: any, row: any) => {
          acc[row.key] = row.value;
          return acc;
        }, {})
      };
      res.json(settingsMap);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/settings", (req, res) => {
    try {
      const settingsData = req.body;
      const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
      const tx = db.transaction(() => {
        for (const key of Object.keys(settingsData)) {
          stmt.run(key, settingsData[key]);
          settings[key] = settingsData[key];
        }
      });
      tx();
      res.json({ status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // -- Students API --
  app.get("/api/students", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM students").all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/students", (req, res) => {
    const { name, roll_number, department, guardian_name, guardian_phone, address, status, class_name, academic_year, result, password, photo, fee_paid, fee_due } = req.body;
    try {
      const dbResult = db.prepare(
        "INSERT INTO students (name, roll_number, department, guardian_name, guardian_phone, address, status, class_name, academic_year, result, password, photo, fee_paid, fee_due) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(name, roll_number, department, guardian_name, guardian_phone, address, status, class_name, academic_year, result, password || '', photo || '', fee_paid || 0, fee_due || 0);
      res.json({ id: dbResult.lastInsertRowid, status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/students/:id", (req, res) => {
    const { name, roll_number, department, guardian_name, guardian_phone, address, status, class_name, academic_year, result, password, photo, fee_paid, fee_due } = req.body;
    const { id } = req.params;
    try {
      db.prepare(
        "UPDATE students SET name = ?, roll_number = ?, department = ?, guardian_name = ?, guardian_phone = ?, address = ?, status = ?, class_name = ?, academic_year = ?, result = ?, password = ?, photo = ?, fee_paid = ?, fee_due = ? WHERE id = ?"
      ).run(name, roll_number, department, guardian_name, guardian_phone, address, status, class_name, academic_year, result, password || '', photo || '', fee_paid || 0, fee_due || 0, id);
      res.json({ status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/students/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM students WHERE id = ?").run(id);
      res.json({ status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // -- Admissions API --
  app.post("/api/admissions", (req, res) => {
    const { student_name, dob, guardian_name, contact_number, department, payment_method, trx_id } = req.body;
    try {
      const result = db.prepare(
        "INSERT INTO admissions (student_name, dob, guardian_name, contact_number, department, payment_method, trx_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).run(student_name, dob, guardian_name, contact_number, department, payment_method, trx_id);
      res.json({ id: result.lastInsertRowid, status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admissions", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM admissions ORDER BY id DESC").all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admissions/:id/status", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
      db.prepare("UPDATE admissions SET status = ? WHERE id = ?").run(status, id);
      res.json({ status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admissions/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM admissions WHERE id = ?").run(id);
      res.json({ status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // -- Donations API --
  app.get("/api/donations", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM donations ORDER BY id DESC").all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/donations/:id/status", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
      db.prepare("UPDATE donations SET status = ? WHERE id = ?").run(status, id);
      res.json({ status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/donations", (req, res) => {
    const { donor_name, amount, donation_type, payment_method, trx_id } = req.body;
    const date = new Date().toISOString();
    try {
      const result = db.prepare(
        "INSERT INTO donations (donor_name, amount, donation_type, payment_method, trx_id, date) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(donor_name, amount, donation_type, payment_method, trx_id, date);

      res.json({ id: result.lastInsertRowid, status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // -- Donors API --
  app.get("/api/donors", (req, res) => {
      try {
        const rows = db.prepare("SELECT * FROM donors ORDER BY total_donated DESC").all();
        res.json(rows);
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
  });

  app.post("/api/donors", (req, res) => {
      const { name, photo, phone, address, total_donated } = req.body;
      try {
        db.prepare("INSERT INTO donors (name, photo, phone, address, total_donated) VALUES (?, ?, ?, ?, ?)").run(name, photo || '', phone || '', address || '', total_donated || 0);
        res.json({ status: "success" });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
  });

  // -- Teachers API --
  app.get("/api/teachers", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM teachers ORDER BY id DESC").all();
      // Remove passwords from response
      const safeRows = rows.map((r: any) => { const { password, ...rest } = r; return rest; });
      res.json(safeRows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/teachers", (req, res) => {
    const { name, title, photo, phone, username, password, has_admin_access } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO teachers (name, title, photo, phone, username, password, has_admin_access) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(name, title, photo || '', phone || '', username || '', password || '', has_admin_access ? 1 : 0);
      res.json({ id: result.lastInsertRowid, status: "success" });
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: "Username already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  });

  app.put("/api/teachers/:id", (req, res) => {
    const { id } = req.params;
    const { name, title, photo, phone, username, password, has_admin_access } = req.body;
    try {
      if (password) {
        db.prepare(`
          UPDATE teachers SET name=?, title=?, photo=?, phone=?, username=?, password=?, has_admin_access=? WHERE id=?
        `).run(name, title, photo || '', phone || '', username || '', password, has_admin_access ? 1 : 0, id);
      } else {
        db.prepare(`
          UPDATE teachers SET name=?, title=?, photo=?, phone=?, username=?, has_admin_access=? WHERE id=?
        `).run(name, title, photo || '', phone || '', username || '', has_admin_access ? 1 : 0, id);
      }
      res.json({ status: "success" });
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: "Username already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  });

  app.delete("/api/teachers/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM teachers WHERE id = ?").run(id);
      res.json({ status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // -- Gallery API --
  app.get("/api/gallery", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM gallery ORDER BY id DESC").all();
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/gallery", (req, res) => {
    const { image, caption } = req.body;
    const date = new Date().toISOString();
    try {
      const result = db.prepare(
        "INSERT INTO gallery (image, caption, date) VALUES (?, ?, ?)"
      ).run(image, caption, date);
      res.json({ id: result.lastInsertRowid, status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/gallery/:id", (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("DELETE FROM gallery WHERE id = ?").run(id);
      res.json({ status: "success" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Note: express v4 needs simple '*'.
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Explicitly handle /admin and related routes
    app.get("/admin*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only listen if not running on Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  
  return app;
}

// Global app instance for Vercel
let app: express.Express;

async function initServer() {
  if (!app) {
    app = await startServer();
  }
  return app;
}

// Vercel serverless function entry
export default async (req: any, res: any) => {
  const expressApp = await initServer();
  expressApp(req, res);
};

// Local entry point
if (!process.env.VERCEL) {
  startServer();
}
