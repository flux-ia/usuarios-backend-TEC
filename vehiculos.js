module.exports = (db) => {
  const router = require('express').Router();

  // Obtener todos los vehículos
  router.get('/', (req, res) => {
    const vehiculos = db.get('vehiculos').value();
    res.json(vehiculos);
  });

  // Agregar nuevo vehículo
  router.post('/', (req, res) => {
    const { patente } = req.body;
    
    if (!patente) {
      return res.status(400).json({ error: 'La patente es requerida' });
    }

    const vehiculos = db.get('vehiculos').value();
    
    if (vehiculos.includes(patente.toUpperCase())) {
      return res.status(400).json({ error: 'La patente ya existe' });
    }

    db.get('vehiculos')
      .push(patente.toUpperCase())
      .write();

    res.json({ success: true, message: 'Vehículo agregado' });
  });

  // Eliminar vehículo
  router.delete('/:patente', (req, res) => {
    const { patente } = req.params;
    const vehiculos = db.get('vehiculos').value();
    
    if (!vehiculos.includes(patente.toUpperCase())) {
      return res.status(404).json({ error: 'Patente no encontrada' });
    }

    db.get('vehiculos')
      .pull(patente.toUpperCase())
      .write();

    res.json({ success: true, message: 'Vehículo eliminado' });
  });

  return router;
};
