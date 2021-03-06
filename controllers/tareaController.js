const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        //Extraer proyecto    
        const { proyecto } = req.body;
        
        const proy = await Proyecto.findById(proyecto);
        if (!proy) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual le pertenece al usuario actual
        if (proy.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Crear la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

};

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        //Extraer proyecto    
        const { proyecto } = req.query;
        
        const proy = await Proyecto.findById(proyecto);
        if (!proy) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual le pertenece al usuario actual
        if (proy.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer proyecto    
        const { proyecto, nombre, estado } = req.body;

        //Verificar que existe la tarea
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: "No existe la tarea" });
        }

        //extraer proyecto
        const proy = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual le pertenece al usuario actual
        if (proy.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Crear nueva info
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate(
            { _id : req.params.id },
            nuevaTarea,
            { new : true }
        );
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

//Eliminar Tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer proyecto    
        const { proyecto } = req.query;

        //Verificar que existe la tarea
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: "No existe la tarea" });
        }

        //extraer proyecto
        const proy = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual le pertenece al usuario actual
        if (proy.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Eliminar
        await Tarea.findByIdAndRemove({ _id: req.params.id });
        res.json({msg: 'Tarea Eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};