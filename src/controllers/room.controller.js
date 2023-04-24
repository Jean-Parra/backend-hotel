const Room = require('../models/room.model');

const agregar = async(req, res) => {
    try {
        const { numero, tipo, descripcion, capacidad_minima, capacidad_maxima, precio_persona } = req.body;
        const imagen = {
            data: req.file.buffer,
            type: req.file.mimetype
        };
        console.log(req.file);

        const room = new Room({ numero, tipo, descripcion, capacidad_minima, capacidad_maxima, precio_persona, imagen });
        await room.save();
        return res.status(200).json({ message: 'Habitación registrada exitosamente' });
    } catch (err) {
        console.error('Error en el endpoint de registrar habitaciones:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const obtenerTodas = async(req, res) => {
    try {
        const rooms = await Room.find();
        return res.status(200).json(rooms);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Error al obtener las habitaciones');
    }
};



export const methods = {
    agregar,
    obtenerTodas
};