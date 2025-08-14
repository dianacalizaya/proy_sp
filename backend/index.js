const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// Log startup information
console.log('=== INFORMACIÓN DE INICIO DEL SERVIDOR ===');
console.log('Directorio actual:', __dirname);
console.log('Versión de Node:', process.version);
console.log('Sistema operativo:', os.platform());
console.log('Variables de entorno:', Object.keys(process.env));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Ruta de health check con información detallada
app.get('/health', (req, res) => {
  console.log('Health check solicitado');
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    time: new Date().toISOString(),
    node_version: process.version,
    env: process.env.NODE_ENV,
    platform: os.platform(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    directory: __dirname,
    files: fs.readdirSync(path.join(__dirname, '..')).filter(f => !f.startsWith('.')),
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

// Servir archivos estáticos y otras rutas después de confirmar que el servidor funciona
app.use(express.static(path.join(__dirname, '..')));

app.get('*', (req, res) => {
  console.log(`Solicitud recibida para: ${req.url}`);
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, () => {
  console.log(`Servidor backend iniciado en puerto ${port}`);
  console.log(`Directorio actual: ${__dirname}`);
  console.log(`Ruta a index.html: ${path.join(__dirname, '../index.html')}`);
});
