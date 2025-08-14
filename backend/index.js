const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname, '..')));

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    time: new Date().toISOString()
  });
});

// API endpoints temporales (sin base de datos)
app.post('/api/demographics', (req, res) => {
  res.status(200).json({ message: 'Datos recibidos correctamente' });
});

app.post('/api/answers', (req, res) => {
  res.status(200).json({ message: 'Respuesta guardada correctamente' });
});

// Ruta principal - sirve index.html para todas las rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Rutas de la API (todas bajo /api)
app.get('/api', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Ruta para verificar la conexión a la base de datos
app.get('/api/status', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      server: 'running',
      database: 'connected',
      time: dbResult.rows[0].now,
      env: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        user: process.env.DB_USER
      }
    });
  } catch (error) {
    res.status(500).json({
      server: 'running',
      database: 'error',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en puerto ${port}`);
});
