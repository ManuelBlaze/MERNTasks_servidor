const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, response) => {

    //Extraer email y password

    const { email, password } = req.body;
    
    try {
        //Revisar que el email sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return response.status(400).json({ msg: 'El usuario ya existe' });
        }

        //Crea el nuevo usuario
        usuario = new Usuario(req.body);

        //guardar el nuevo usuario
        await usuario.save();

        //Mensaje de confirmación
        response.json({ msg: "Usuario creado correctamente" });
    } catch (error) {
        console.log(error);
        response.status(400).send('Hubo un error');
    }
}