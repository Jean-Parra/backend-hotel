import config from "../config";
import { getConnection } from "../database/database";
import User from "../models/user.model";
const jwt = require('jsonwebtoken');

const login = async(req, res) => {
    try {
        const connection = await getConnection();

        const { correo, contraseña } = req.body;
        const query = 'SELECT * FROM usuarios WHERE correo = ?';
        const result = await connection.query(query, [correo]);
        const user = result[0];

        if (!user) {
            return res.status(401).json({ message: 'El correo no está registrado' });
        }

        const isValidPassword = await User.validatePassword(contraseña, user.CONTRASEÑA);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ userId: user.ID }, config.secret, {
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
        const connection = await getConnection();
        await User.createTableIfNotExists();
        const { nombres, apellidos, correo, cedula, edad, genero, contraseña } = req.body;
        const checkQuery1 = 'SELECT * FROM usuarios WHERE cedula = ?';
        const checkResult1 = await connection.query(checkQuery1, [cedula]);
        const existingUser = checkResult1[0];
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }
        const checkQuery2 = 'SELECT * FROM usuarios WHERE correo = ?';
        const checkResult2 = await connection.query(checkQuery2, [correo]);
        const existingEmail = checkResult2[0];
        if (existingEmail) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }
        const encryptedPassword = await User.encryptPassword(contraseña);
        const insertQuery = 'INSERT INTO usuarios (id_permiso,nombres, apellidos, correo, cedula, edad, genero, contraseña) VALUES ("1",?, ?, ?, ?, ?, ?, ?)';

        await connection.query(insertQuery, [nombres, apellidos, correo, cedula, edad, genero, encryptedPassword]);
        const token = jwt.sign({ userId: user.ID }, config.secret, {
            expiresIn: '7d'
        });
        return res.status(200).json({ message: 'Usuario registrado exitosamente', token: token });
    } catch (err) {
        console.error('Error en el endpoint de registro:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


const verificar = async(req, res, next) => {
    try {
        await User.verifyToken(req, res, next);
        return res.status(200).json({ message: 'Token seguro', id: req.userId });
    } catch (err) {
        if (err.message === 'Token inválido') {
            return res.status(401).json({ message: 'Token inválido' });
        } else {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

// Endpoint para obtener usuarios registrados
const usuariosRegistrados = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const connection = await getConnection();
        const { q: textoBusqueda } = req.query;
        let query = `SELECT * FROM usuarios`;
        const queryParams = [];
        if (textoBusqueda && textoBusqueda !== '') {
            query += ` WHERE NOMBRES LIKE ? OR APELLIDOS LIKE ? OR CORREO LIKE ? OR CEDULA LIKE ?`;
            const searchParam = `%${textoBusqueda}%`;
            queryParams.push(searchParam, searchParam, searchParam, searchParam);
        }
        query += ` LIMIT ${limit} OFFSET ${offset}`;
        console.log(query);
        const result = await connection.query(query, queryParams);
        if (!result || result.length === 0) {
            return res.status(401).json({ message: 'No se encontraron usuarios registrados' });
        }
        const totalUsuariosQuery = `SELECT COUNT(*) as total FROM usuarios`;
        const totalUsuariosResult = await connection.query(totalUsuariosQuery);
        const totalUsuarios = totalUsuariosResult[0].total;
        return res.status(200).json({ message: 'Lista de usuarios obtenidos', usuarios: result, cantidad: totalUsuarios });
    } catch (err) {
        console.error('Error en el endpoint de obtener usuarios:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const methods = {
    login,
    register,
    verificar,
    usuariosRegistrados
};