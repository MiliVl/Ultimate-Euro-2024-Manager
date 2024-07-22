const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5003;

app.use(cors());
app.use(express.json());

const dbPath = "C:\\Fotball-Manager-2024\\backend\\fotball_database.db" ;

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
})

app.get('/', (req, res) => {
    res.send('Backend server is running.');
});

app.get('/api/tabel_joc', (req, res) => {
    const sql = 'SELECT * FROM tabel_joc';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error executing SQL:', err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        res.json(rows); 
    });
});


app.post('/api/tabel_joc', (req, res) => {
    const { nume, scor } = req.body;
    const sql = 'INSERT INTO tabel_joc (nume, scor) VALUES (?, ?)';
    db.run(sql, [nume, scor], function (err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.get('/api/tabel_joc/:countryId', (req, res) => {
    const countryId = req.params.countryId;
    const sql = 'SELECT * FROM tabel_joc WHERE Country = ?';
    db.all(sql, [countryId], (err, rows) => {
        if (err) {
            console.error('Error executing SQL:', err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        res.json(rows); 
    });
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log('Calea către baza de date:', dbPath);
});
