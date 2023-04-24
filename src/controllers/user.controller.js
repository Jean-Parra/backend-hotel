const User = require('../models/user.model');
const verifyToken = require('./verifyToken').default;
const jwt = require('jsonwebtoken');
const config = require('../config');

const obtenerPermiso = async(req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        if (!user) {
            return res.status(401).json({ message: 'El ID no esta registrado' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error en el endpoint de obtener permiso:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }

};

const login = async(req, res) => {
    try {
        const user = await User.findOne({ correo: req.body.correo })
        if (!user) {
            return res.status(401).json({ message: 'El correo no está registrado' });
        }
        console.log(req.body.contraseña);
        console.log(user.contraseña);

        const isValidPassword = await user.validatePassword(req.body.contraseña, user.contraseña);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ userId: user._id }, config.default.secret, {
            expiresIn: '7d'
        });
        return res.status(200).json({ message: 'Inicio de sesión exitoso', token: token });
    } catch (err) {
        console.error('Error en el endpoint de login:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const register = async(req, res) => {
    try {
        const { nombres, apellidos, correo, cedula, edad, genero, contraseña } = req.body;
        const existingUser = await User.findOne({ cedula });
        if (existingUser) {
            return res.status(400).json({ message: 'La cedula ya esta registrada' });
        }
        const existingEmail = await User.findOne({ correo });
        if (existingEmail) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }
        const permiso = 'usuarios';
        const user = new User({ nombres, apellidos, correo, cedula, edad, genero, contraseña, permiso });
        user.contraseña = await user.encryptPassword(contraseña);
        await user.save();
        const token = jwt.sign({ userId: user._id }, config.default.secret, {
            expiresIn: '7d'
        });
        return res.status(200).json({ message: 'Usuario registrado exitosamente', token: token });
    } catch (err) {
        console.error(err);
        console.error('Error en el endpoint de registro:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


const verificar = async(req, res, next) => {
    try {
        await verifyToken(req, res, next);
        return res.status(200).json({ message: 'Token seguro', id: req.userId });
    } catch (err) {
        if (res.headersSent) {
            return next(err);
        }
        if (err.message === 'Token inválido') {
            console.log('Token inválido');
            return res.status(401).json({ message: 'Token inválido' });
        } else {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};


const usuariosRegistrados = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { q: textoBusqueda } = req.query;
        let query = {};
        if (textoBusqueda && textoBusqueda !== '') {
            query = {
                $or: [
                    { nombres: { $regex: textoBusqueda, $options: 'i' } },
                    { apellidos: { $regex: textoBusqueda, $options: 'i' } },
                    { correo: { $regex: textoBusqueda, $options: 'i' } },
                    { genero: { $regex: textoBusqueda, $options: 'i' } },
                    { cedula: { $regex: textoBusqueda, $options: 'i' } },
                    { edad: { $regex: textoBusqueda, $options: 'i' } },
                ]
            };
        }
        const totalUsuarios = await User.countDocuments(query);
        const usuarios = await User.find(query)
            .skip(offset)
            .limit(limit);
        if (!usuarios || usuarios.length === 0) {
            return res.status(401).json({ message: 'No se encontraron usuarios registrados' });
        }
        return res.status(200).json({ message: 'Lista de usuarios obtenidos', usuarios, cantidad: totalUsuarios });
    } catch (error) {
        console.error('Error en el endpoint de obtener usuarios:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};



export const methods = {
    obtenerPermiso,
    login,
    register,
    verificar,
    usuariosRegistrados
};