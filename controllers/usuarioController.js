const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, response) => {
    
    try {
        let usuario;

        //Crea el nuevo usuario
        usuario = new Usuario(req.body);

        //guardar el nuevo usuario
        await usuario.save();

        //Mensaje de confirmación
        response.send('Usuario creado correctmente');
    } catch (error) {
        console.log(error);
        response.status(400).send('Hubo un error');
    }
}