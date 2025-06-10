// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// DB 연결 풀 생성
const pool = mysql.createPool({
    host: 'localhost',
    user: 'jenty521',
    password: 'j20805',
    database: 'api_search',
    waitForConnections: true,
    connectionLimit: 10
});

// 템플릿 목록 조회
app.get('/api/templates', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM packet_templates');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 특정 템플릿 조회
app.get('/api/templates/:id', async (req, res) => {
    try {
        const [template] = await pool.query(
            'SELECT * FROM packet_templates WHERE id = ?', 
            [req.params.id]
        );
        
        const [fields] = await pool.query(
            'SELECT * FROM packet_fields WHERE template_id = ?',
            [req.params.id]
        );
        
        res.json({ ...template[0], fields });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 템플릿 생성
app.post('/api/templates', async (req, res) => {
    const { title, fields } = req.body;
    
    try {
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        
        const [template] = await conn.query(
            'INSERT INTO packet_templates (title) VALUES (?)',
            [title]
        );
        
        for (const field of fields) {
            await conn.query(
                'INSERT INTO packet_fields (template_id, field_name, byte_size, description) VALUES (?, ?, ?, ?)',
                [template.insertId, field.field_name, field.byte_size, field.description]
            );
        }
        
        await conn.commit();
        conn.release();
        res.status(201).json({ id: template.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 템플릿 수정
app.put('/api/templates/:id', async (req, res) => {
    // 구현 생략 (위와 유사한 방식)
});

// 템플릿 삭제
app.delete('/api/templates/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM packet_templates WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`API 서버 실행 중: http://localhost:${port}`);
});
