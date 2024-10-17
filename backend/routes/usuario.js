import express from 'express';
import { getUsuarios, agregarUsuario, getOneUser } from '../controllers/usuario.js';

const router = express.Router();

router.get("/", getUsuarios);
router.post("/", agregarUsuario);
router.post("/iduser", getOneUser);
export default router;