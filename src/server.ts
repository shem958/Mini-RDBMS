import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Database } from './core/Database';
import { executeSQL } from './parser/parser';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

const db = new Database();

// Create table on server start if it doesn't exist
if (!db.listTables().includes('users')) {
    executeSQL(db, 'CREATE TABLE users (id INT PRIMARY, email STRING UNIQUE, name STRING)');
}

// Endpoint to run SQL queries (simple demo)
app.post('/query', (req, res) => {
    const { sql } = req.body;
    if (!sql) return res.status(400).json({ error: 'SQL query required' });

    try {
        const result = executeSQL(db, sql);
        return res.json({ result });
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
});

// Optional: CRUD helpers for frontend
app.get('/users', (req, res) => {
    try {
        const result = executeSQL(db, 'SELECT * FROM users');
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/users', (req, res) => {
    const { id, email, name } = req.body;
    if (id == null || !email || !name)
        return res.status(400).json({ error: 'id, email, name required' });

    try {
        const sql = `INSERT INTO users VALUES (${id}, "${email}", "${name}")`;
        const result = executeSQL(db, sql);
        res.json({ result });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const sql = `DELETE FROM users WHERE id = ${id}`;
        const result = executeSQL(db, sql);
        res.json({ result });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
