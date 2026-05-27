const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data directory (Render has temporary writable storage)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function readData(fileName) {
    try {
        const filePath = path.join(dataDir, fileName + '.json');
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch(e) {
        return [];
    }
}

function writeData(fileName, data) {
    const filePath = path.join(dataDir, fileName + '.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Initialize data
const users = readData('users');
if (users.length === 0) {
    writeData('users', [{ id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'System Admin' }]);
}

// ==================== API ENDPOINTS ====================
app.get('/api/students', (req, res) => { res.json(readData('students')); });
app.post('/api/students', (req, res) => {
    const students = readData('students');
    const newStudent = { id: Date.now().toString(), ...req.body };
    students.push(newStudent);
    writeData('students', students);
    res.json({ success: true, student: newStudent });
});

app.get('/api/staff', (req, res) => { res.json(readData('staff')); });
app.post('/api/staff', (req, res) => {
    const staff = readData('staff');
    const newStaff = { id: Date.now().toString(), ...req.body };
    staff.push(newStaff);
    writeData('staff', staff);
    res.json({ success: true, staff: newStaff });
});

app.get('/api/fees', (req, res) => { res.json(readData('fees')); });
app.post('/api/fees', (req, res) => {
    const fees = readData('fees');
    const newFee = { id: Date.now().toString(), ...req.body };
    fees.push(newFee);
    writeData('fees', fees);
    res.json({ success: true, fee: newFee });
});

app.get('/api/exams', (req, res) => { res.json(readData('exams')); });
app.post('/api/exams', (req, res) => {
    const exams = readData('exams');
    const newExam = { id: Date.now().toString(), ...req.body };
    exams.push(newExam);
    writeData('exams', exams);
    res.json({ success: true, exam: newExam });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData('users');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, role: user.role, name: user.name });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/settings', (req, res) => {
    const settings = readData('settings');
    res.json(settings[0] || { schoolName: 'School Management System' });
});

app.post('/api/settings', (req, res) => {
    writeData('settings', [req.body]);
    res.json({ success: true });
});

// Serve frontend
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.get('/:page.html', (req, res) => { res.sendFile(path.join(__dirname, 'public', `${req.params.page}.html`)); });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ School Management System running on port ${PORT}`);
    console.log(`🔐 Login: admin / admin123`);
});