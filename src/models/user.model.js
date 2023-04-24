const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userShema = new Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { index: true, type: String, required: true },
    cedula: { index: true, type: String, required: true },
    edad: { type: String, required: true },
    genero: { type: String, required: true },
    contraseña: { type: String, required: true },
    permiso: { type: String, required: true }
});

userShema.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

userShema.methods.validatePassword = function(password, haspassword) {
    return bcrypt.compare(password, haspassword);
};

module.exports = model('User', userShema)