const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static('public'));

// Helper: Read JSON file
function readData(fileName) {
    try {
        const data = fs.readFileSync('./data/' + fileName + '.json', 'utf8');
        return JSON.parse(data);
    } catch(e) {
        return [];
    }
}

// Helper: Write JSON file
function writeData(fileName, data) {
    fs.writeFileSync('./data/' + fileName + '.json', JSON.stringify(data, null, 2));
}

// ==================== STUDENTS API ====================
app.get('/api/students', (req, res) => {
    res.json(readData('students'));
});

app.post('/api/students', (req, res) => {
    const students = readData('students');
    students.push(req.body);
    writeData('students', students);
    res.json({ success: true });
});

app.put('/api/students/:id', (req, res) => {
    const students = readData('students');
    const index = students.findIndex(s => s.id === req.params.id);
    if (index !== -1) { students[index] = req.body; writeData('students', students); }
    res.json({ success: true });
});

app.delete('/api/students/:id', (req, res) => {
    let students = readData('students');
    students = students.filter(s => s.id !== req.params.id);
    writeData('students', students);
    res.json({ success: true });
});

// ==================== STAFF API ====================
app.get('/api/staff', (req, res) => { res.json(readData('staff')); });
app.post('/api/staff', (req, res) => {
    const staff = readData('staff'); staff.push(req.body);
    writeData('staff', staff); res.json({ success: true });
});

// ==================== FEES API ====================
app.get('/api/fees', (req, res) => { res.json(readData('fees')); });
app.post('/api/fees', (req, res) => {
    const fees = readData('fees'); fees.push(req.body);
    writeData('fees', fees); res.json({ success: true });
});

// ==================== EXAMS API ====================
app.get('/api/exams', (req, res) => { res.json(readData('exams')); });
app.post('/api/exams', (req, res) => {
    const exams = readData('exams'); exams.push(req.body);
    writeData('exams', exams); res.json({ success: true });
});

// ==================== USERS API ====================
app.get('/api/users', (req, res) => { res.json(readData('users')); });
app.post('/api/users', (req, res) => {
    const users = readData('users'); users.push(req.body);
    writeData('users', users); res.json({ success: true });
});

// ==================== LOGIN API ====================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData('users');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, role: user.role, name: user.name });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

// ==================== BACKUP API ====================
app.get('/api/backup', (req, res) => {
    const backup = {};
    const files = ['students','staff','fees','exams','subjects','sba','payroll','expenses','hostel','transport','library','users','settings'];
    files.forEach(f => { backup[f] = readData(f); });
    res.json(backup);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('============================================');
    console.log('  🏫 SCHOOL MANAGEMENT SYSTEM');
    console.log('  Server running on port ' + PORT);
    console.log('  Access from other PCs: http://YOUR-IP:' + PORT);
    console.log('============================================');
});