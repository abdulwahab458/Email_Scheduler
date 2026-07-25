import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  scheduleEmails,
  getScheduled,
  getSent,
  parseCsv,
  csvUploadMiddleware,
} from '../controllers/email.controller';

const router = Router();

router.use(authMiddleware);

router.post('/schedule', scheduleEmails);
router.get('/scheduled', getScheduled);
router.get('/sent', getSent);
router.post('/parse-csv', csvUploadMiddleware, parseCsv);

export default router;
