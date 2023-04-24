import { Router } from "express";
import { methods as roomController } from "../controllers/room.controller";

const multer = require('multer');
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/agregar', upload.single('imagen'), roomController.agregar);
router.get('/obtenerTodas', roomController.obtenerTodas);


export default router;