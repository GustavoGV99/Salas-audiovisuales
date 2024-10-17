import express from 'express';
import { login, cerrarSesion, session} from '../controllers/login.js';
import { requiereToken } from '../middlewares/requiereToken.js'

const router = express.Router();

router.post("/", login);
router.get("/logout", cerrarSesion);
router.get("/session", session)

export default router;