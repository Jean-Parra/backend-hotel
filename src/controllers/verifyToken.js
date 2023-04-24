import { verify } from 'jsonwebtoken';
const config = require('../config');

async function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        console.log("no envio token");
        return res.status(401).send({ auth: false, message: 'No se proporcionó token' });
    }
    try {
        console.log("intentando");
        console.log(token);
        console.log(config.default.secret, );
        console.log(verify(token, config.default.secret));

        const decoded = verify(token, config.default.secret);
        console.log(decoded);
        req.userId = decoded.userId;
    } catch (err) {
        throw new Error('Token inválido');
    }
};

export default verifyToken;