import { Router } from "express";
import { methods as userController } from "../controllers/user.controller";

const router = Router();


router.post('/register', userController.register);
router.post("/login", userController.login);
router.get("/verificar", userController.verificar);
router.get("/registrados", userController.usuariosRegistrados);



export default router;