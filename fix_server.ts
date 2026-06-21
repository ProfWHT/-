import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Admins
content = content.replace(
  /const admins = db\.prepare\("SELECT id, username, role FROM users WHERE role = 'admin'"\)\.all\(\);/,
  `const admins = users.filter((u: any) => u.role === 'admin');`
);

content = content.replace(
  /db\.prepare\("INSERT INTO users \(username, password, role\) VALUES \(\?, \?, 'admin'\)"\)\.run\(username, password\);/,
  `
      const newUser = { id: Date.now(), username, password, role: 'admin' };
      users.push(newUser);
      syncToFirestore('users', newUser.id, newUser);
  `
);

content = content.replace(
  /const stmt = db\.prepare\("UPDATE users SET password = \? WHERE username = \? AND password = \?"\);\n\s+const result = stmt\.run\(newPassword, username, currentPassword\);\n\s+if \(result\.changes > 0\) {/,
  `
      const index = users.findIndex((u: any) => u.username === username && u.password === currentPassword);
      if (index > -1) {
        users[index].password = newPassword;
        syncToFirestore('users', users[index].id, users[index]);
  `
);

// Student Login
content = content.replace(
  /const student = db\.prepare\("SELECT id, name, roll_number, department, class_name, academic_year, result, photo, fee_paid, fee_due, status FROM students WHERE roll_number = \? AND password = \?"\)\.get\(roll_number, password\);/,
  `const student = students.find((s: any) => s.roll_number === roll_number && s.password === password);`
);

content = content.replace(
  /const student = db\.prepare\("SELECT \* FROM students WHERE id = \?"\)\.get\(id\);/g,
  `const student = students.find((s: any) => String(s.id) === String(id));`
);

// Dashboard
content = content.replace(
  /const totalStudents = db\.prepare\("SELECT COUNT\(\*\) as count FROM students WHERE status != 'completed'"\)\.get\(\) as any;\n\s+const totalAdmissions = db\.prepare\("SELECT COUNT\(\*\) as count FROM admissions WHERE status = 'pending'"\)\.get\(\) as any;\n\s+const totalDonations = db\.prepare\("SELECT SUM\(amount\) as total FROM donations WHERE status = 'received'"\)\.get\(\) as any;\n\s+const teachersCount = db\.prepare\("SELECT COUNT\(\*\) as count FROM teachers"\)\.get\(\) as any;/,
  `
      const totalStudents = { count: students.filter((s:any) => s.status !== 'completed').length };
      const totalAdmissions = { count: admissions.filter((a:any) => a.status === 'pending').length };
      const totalDonations = { total: donations.filter((d:any) => d.status === 'received').reduce((sum:number, d:any) => sum + Number(d.amount), 0) };
      const teachersCount = { count: teachers.length };
  `
);

// Settings
content = content.replace(
  /const rows = db\.prepare\("SELECT \* FROM settings"\)\.all\(\) as any\[\];\n\s+const formattedSettings: Record<string, string> = \{\};\n\s+rows\.forEach\(row => \{\n\s+formattedSettings\[row\.key\] = row\.value;\n\s+\}\);\n\s+res\.json\(formattedSettings\);/,
  `res.json(settings);`
);

content = content.replace(
  /const stmt = db\.prepare\("INSERT OR REPLACE INTO settings \(key, value\) VALUES \(\?, \?\)"\);\n\s+Object\.entries\(req\.body\)\.forEach\(\(\[key, value\]\) => \{\n\s+stmt\.run\(key, String\(value\)\);\n\s+\}\);/,
  `
      Object.entries(req.body).forEach(([key, value]) => {
        settings[key] = String(value);
        syncToFirestore('settings', key, { value: String(value) });
      });
  `
);

content = content.replace(
  /const rows = db\.prepare\("SELECT \* FROM students"\)\.all\(\);/g,
  `const rows = students;`
);

// Add student
content = content.replace(
  /const dbResult = db\.prepare\([\s\S]*?([^]*?)\)\.run\([\s\S]*?([^]*?)\);\n\s+res\.json\(\{ id: dbResult\.lastInsertRowid \}\);/m,
  `
      const newUser = { id: Date.now(), name, roll_number, password, department, class_name, academic_year, result, photo: photo || '', fee_paid: fee_paid || 0, fee_due: fee_due || 0, status: status || 'active' };
      students.push(newUser);
      syncToFirestore('students', newUser.id, newUser);
      res.json({ id: newUser.id });
  `
);

// Edit student
content = content.replace(
  /db\.prepare\([\s\S]*?UPDATE students SET[\s\S]*?\)\.run\([\s\S]*?\);\n\s+res\.json\(\{ success: true \}\);/m,
  `
      const idx = students.findIndex((s:any) => String(s.id) === String(id));
      if (idx > -1) {
        students[idx] = { ...students[idx], name, roll_number, password: password || students[idx].password, department, class_name, academic_year, result, photo, fee_paid, fee_due, status };
        syncToFirestore('students', id, students[idx]);
      }
      res.json({ success: true });
  `
);

content = content.replace(
  /db\.prepare\("DELETE FROM students WHERE id = \?"\)\.run\(id\);/,
  `
      const idx = students.findIndex((s:any) => String(s.id) === String(id));
      if (idx > -1) {
        students.splice(idx, 1);
        syncToFirestore('students', id, null);
      }
  `
);

// Admissions
content = content.replace(
  /const result = db\.prepare\([\s\S]*?INSERT INTO admissions[\s\S]*?\)\.run\([\s\S]*?\);\n\s+res\.json\(\{ id: result\.lastInsertRowid \}\);/m,
  `
      const newAd = { id: Date.now(), student_name, father_name, mother_name, birth_certificate, dob, previous_madrasa, current_para, address, gender, blood_group, current_class, phone_number, status: 'pending', created_at: new Date().toISOString() };
      admissions.push(newAd);
      syncToFirestore('admissions', newAd.id, newAd);
      res.json({ id: newAd.id });
  `
);

content = content.replace(
  /const rows = db\.prepare\("SELECT \* FROM admissions ORDER BY id DESC"\)\.all\(\);/,
  `const rows = [...admissions].sort((a:any, b:any) => b.id - a.id);`
);

content = content.replace(
  /db\.prepare\("UPDATE admissions SET status = \? WHERE id = \?"\)\.run\(status, id\);/,
  `
      const idx = admissions.findIndex((a:any) => String(a.id) === String(id));
      if (idx > -1) {
        admissions[idx].status = status;
        syncToFirestore('admissions', id, admissions[idx]);
      }
  `
);

content = content.replace(
  /db\.prepare\("DELETE FROM admissions WHERE id = \?"\)\.run\(id\);/,
  `
      const idx = admissions.findIndex((a:any) => String(a.id) === String(id));
      if (idx > -1) {
        admissions.splice(idx, 1);
        syncToFirestore('admissions', id, null);
      }
  `
);

// Donations
content = content.replace(
  /const rows = db\.prepare\("SELECT \* FROM donations ORDER BY id DESC"\)\.all\(\);/,
  `const rows = [...donations].sort((a:any, b:any) => b.id - a.id);`
);

content = content.replace(
  /db\.prepare\("UPDATE donations SET status = \? WHERE id = \?"\)\.run\(status, id\);/,
  `
      const idx = donations.findIndex((d:any) => String(d.id) === String(id));
      if (idx > -1) {
        donations[idx].status = status;
        syncToFirestore('donations', id, donations[idx]);
      }
  `
);

content = content.replace(
  /const result = db\.prepare\([\s\S]*?INSERT INTO donations[\s\S]*?\)\.run\([\s\S]*?\);\n\s+res\.json\(\{ id: result\.lastInsertRowid \}\);/m,
  `
      const newD = { id: Date.now(), donor_name, purpose, amount, status: 'pending', date: new Date().toISOString() };
      donations.push(newD);
      syncToFirestore('donations', newD.id, newD);
      res.json({ id: newD.id });
  `
);

// Donors
content = content.replace(
  /const rows = db\.prepare\("SELECT \* FROM donors ORDER BY total_donated DESC"\)\.all\(\);/,
  `const rows = [...donors].sort((a:any, b:any) => b.total_donated - a.total_donated);`
);

content = content.replace(
  /db\.prepare\("INSERT INTO donors \(name, photo, phone, address, total_donated\) VALUES \(\?, \?, \?, \?, \?\)"\)\.run\(name, photo \|\| '', phone \|\| '', address \|\| '', total_donated \|\| 0\);/,
  `
        const newDonor = { id: Date.now(), name, photo: photo || '', phone: phone || '', address: address || '', total_donated: total_donated || 0 };
        donors.push(newDonor);
        syncToFirestore('donors', newDonor.id, newDonor);
  `
);

// Teachers
content = content.replace(
  /const rows = db\.prepare\("SELECT \* FROM teachers ORDER BY id DESC"\)\.all\(\);/,
  `const rows = [...teachers].sort((a:any, b:any) => b.id - a.id);`
);

content = content.replace(
  /const result = db\.prepare\([\s\S]*?INSERT INTO teachers[\s\S]*?\)\.run\([\s\S]*?\);\n\s+res\.json\(\{ id: result\.lastInsertRowid \}\);/m,
  `
      const newT = { id: Date.now(), name, title, photo, is_director, has_admin_access, username, password };
      teachers.push(newT);
      syncToFirestore('teachers', newT.id, newT);
      res.json({ id: newT.id });
  `
);

content = content.replace(
  /db\.prepare\([\s\S]*?UPDATE teachers SET[\s\S]*?\)\.run\([\s\S]*?\);\n\s+res\.json\(\{ success: true \}\);/m,
  `
        const idx = teachers.findIndex((t:any) => String(t.id) === String(id));
        if (idx > -1) {
          teachers[idx] = { ...teachers[idx], name, title, photo, is_director, has_admin_access, username, password };
          syncToFirestore('teachers', id, teachers[idx]);
        }
        res.json({ success: true });
  `
);

content = content.replace(
  /db\.prepare\("DELETE FROM teachers WHERE id = \?"\)\.run\(id\);/,
  `
      const idx = teachers.findIndex((t:any) => String(t.id) === String(id));
      if (idx > -1) {
        teachers.splice(idx, 1);
        syncToFirestore('teachers', id, null);
      }
  `
);

// Gallery
content = content.replace(
  /const rows = db\.prepare\("SELECT \* FROM gallery ORDER BY id DESC"\)\.all\(\);/,
  `const rows = [...gallery].sort((a:any, b:any) => b.id - a.id);`
);

content = content.replace(
  /const result = db\.prepare\([\s\S]*?INSERT INTO gallery[\s\S]*?\)\.run\([\s\S]*?\);\n\s+res\.json\(\{ id: result\.lastInsertRowid \}\);/m,
  `
      const newG = { id: Date.now(), url, title };
      gallery.push(newG);
      syncToFirestore('gallery', newG.id, newG);
      res.json({ id: newG.id });
  `
);

content = content.replace(
  /db\.prepare\("DELETE FROM gallery WHERE id = \?"\)\.run\(id\);/,
  `
      const idx = gallery.findIndex((g:any) => String(g.id) === String(id));
      if (idx > -1) {
        gallery.splice(idx, 1);
        syncToFirestore('gallery', id, null);
      }
  `
);

// Remove anything remaining regarding db.prepare
fs.writeFileSync('server.ts', content, 'utf8');
