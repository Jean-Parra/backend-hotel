import { genSalt, hash, compare } from 'bcrypt';
import { getConnection } from "../database/database";
import config from "./../config";
const jwt = require('jsonwebtoken');

const User = {
    encryptPassword: async function(password) {
        try {
            const salt = await genSalt(10);
            return hash(password, salt);
        } catch (err) {
            console.error('Error al encriptar la contraseña:', err);
            throw err;
        }
    },

    validatePassword: async function(password, hash) {
        try {
            if (!password) {
                throw new Error('Faltan contraseña');
            } else if (!hash) {
                throw new Error('Faltan hash');
            }

            return await compare(password, hash);
        } catch (err) {
            console.error('Error al validar la contraseña:', err);
            throw err;
        }
    },
    verifyToken: async function(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).send({ auth: false, message: 'No se proporcionó token' });
        }
        try {
            const decoded = jwt.verify(token, config.secret);
            req.userId = decoded.userId;
            return next();
        } catch (err) {
            throw new Error('Token inválido');
        }
    },

    createTableIfNotExists: async function() {
        try {
            const connection = await getConnection();
            const checkQuery = 'SHOW TABLES LIKE "usuarios"';
            const checkResult = await connection.query(checkQuery);
            if (checkResult.length > 0) {
                console.log('La tabla usuarios ya existe en la base de datos');
                return;
            }
            const createQuery = `
                CREATE TABLE usuarios (
                    ID INT AUTO_INCREMENT PRIMARY KEY,
                    NOMBRES VARCHAR(40) NOT NULL,
                    APELLIDOS VARCHAR(40) NOT NULL,
                    CORREO VARCHAR(100) NOT NULL,
                    CEDULA BIGINT NOT NULL,
                    EDAD INT NOT NULL,
                    GENERO VARCHAR(10) NOT NULL,
                    CONTRASEÑA VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
                )
            `;
            await connection.query(createQuery);
            console.log('La tabla usuarios ha sido creada en la base de datos');
        } catch (err) {
            console.error('Error al crear la tabla usuarios:', err);
            throw err;
        }
    }
};

export default User;