import express from 'express';
import { sendContactMessage } from '../controllers/contact.controller';

const router = express.Router();

router.post('/', sendContactMessage);

export default router;