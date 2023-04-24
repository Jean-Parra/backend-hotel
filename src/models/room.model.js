const { Schema, model } = require('mongoose');

const roomShema = new Schema({
    numero: { type: Number, required: true },
    tipo: { type: String, required: true },
    descripcion: { type: String, required: true },
    capacidad_minima: { type: Number, required: true },
    capacidad_maxima: { type: Number, required: true },
    precio_persona: { type: Number, required: true },
    imagen: {
        data: { type: Buffer, required: true },
        type: { type: String, required: true }
    }
});


module.exports = model('Room', roomShema)