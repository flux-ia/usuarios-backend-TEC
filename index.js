const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'tu-clave-secreta';

// Configuración de lowdb
const adapter = new FileSync('db.json');
const db = low(adapter);

// Inicializar DB con datos por defecto
db.defaults({
  usuarios: {
    gaston: "gaston1",
    adm: "adm1"
  },
  vehiculos: ["ABC123", "XYZ789", "LMN456"]
}).write();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Middleware de autenticación API KEY
app.use((req, res, next) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }
  next();
});

// Rutas
app.use('/usuarios', require('./routes/usuarios')(db));
app.use('/vehiculos', require('./routes/vehiculos')(db));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ status: 'Backend funcionando', version: '1.0.0' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
