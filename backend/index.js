import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// Endpoint para guardar datos demográficos
app.post('/api/demographics', async (req, res) => {
  const { user_id, age, gender, location } = req.body;
  try {
    await pool.query(
      'INSERT INTO demographics (user_id, age, gender, location) VALUES ($1, $2, $3, $4)',
      [user_id, age, gender, location]
    );
    res.status(201).json({ message: 'Datos demográficos guardados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para guardar respuestas
app.post('/api/answers', async (req, res) => {
  const { user_id, question_id, answer } = req.body;
  try {
    await pool.query(
      'INSERT INTO answers (user_id, question_id, answer) VALUES ($1, $2, $3)',
      [user_id, question_id, answer]
    );
    res.status(201).json({ message: 'Respuesta guardada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en puerto ${port}`);
});
