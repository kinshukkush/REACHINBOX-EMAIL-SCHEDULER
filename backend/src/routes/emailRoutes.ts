import { Router } from 'express';
import { scheduleEmails, getScheduledEmails, getSentEmails, getEmailById } from '../controllers/emailController';

const router = Router();

router.post('/schedule', scheduleEmails);
router.get('/scheduled', getScheduledEmails);
router.get('/sent', getSentEmails);
router.get('/:id', getEmailById);

export default router;
