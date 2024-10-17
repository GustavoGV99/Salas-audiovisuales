import express from 'express';
import { getEventosDia, getEventosMes, agregarEvento,agregarEvento2, eliminarEvento } from '../controllers/eventos.js';
import { requiereToken } from '../middlewares/requiereToken.js'

const router = express.Router();

router.post("/dia", getEventosDia);
router.post("/mes", getEventosMes);
router.post("/", requiereToken, agregarEvento2);
router.delete("/borrar",requiereToken,eliminarEvento);

export default router;