module.exports = (db) => {
  const router = require('express').Router();
  const bcrypt = require('bcryptjs');
  const saltRounds = 10;

  // Obtener todos los usuarios (solo para admin)
  router.get('/', (req, res) => {
    const usuarios = db.get('usuarios').value();
    res.json(usuarios);
  });

  // Agregar nuevo usuario
  router.post('/', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    if (db.get('usuarios').has(username).value()) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    db.get('usuarios')
      .set(username, hashedPassword)
      .write();

    res.json({ success: true, message: 'Usuario creado exitosamente' });
  });

  // Eliminar usuario
  router.delete('/:username', (req, res) => {
    const { username } = req.params;
    
    if (!db.get('usuarios').has(username).value()) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    db.get('usuarios')
      .unset(username)
      .write();

    res.json({ success: true, message: 'Usuario eliminado' });
  });

  // Validar credenciales (login)
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const user = db.get('usuarios').value()[username];
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, user);
    
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ 
      success: true, 
      username, 
      isAdmin: username === 'adm' 
    });
  });

  return router;
};
