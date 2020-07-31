const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');

// Crea un proyecto
// api/proyectos
router.post('/',

    proyectoController.crearProyecto
)

module.exports = router;