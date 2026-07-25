import { Response, NextFunction } from 'express';
import multer from 'multer';
import Sender from '../models/Sender';
import { scheduleEmailBatch, listScheduledEmails, listSentEmails } from '../services/email.service';
import { parseRecipientCsv } from '../utils/csv-parser';
import type { AuthRequest } from '../middleware/auth.middleware';

const upload = multer({ storage: multer.memoryStorage() });

export const csvUploadMiddleware = upload.single('file');

export async function scheduleEmails(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;
    const {
      recipients,
      subject,
      body,
      scheduledAt,
    } = req.body as {
      recipients?: string[];
      subject?: string;
      body?: string;
      scheduledAt?: string;
    };

    if (!recipients?.length || !subject || !body || !scheduledAt) {
      res.status(400).json({ error: 'recipients, subject, body, and scheduledAt are required' });
      return;
    }

    const senders = await Sender.findAll({ where: { is_active: true } });
    if (!senders.length) {
      res.status(503).json({ error: 'No senders configured' });
      return;
    }
    const sender = senders[Math.floor(Math.random() * senders.length)];

    const result = await scheduleEmailBatch({
      userId,
      recipients,
      subject,
      body,
      scheduledAt: new Date(scheduledAt),
      senderEmail: sender.email,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getScheduled(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const data = await listScheduledEmails(userId, page, limit);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getSent(
  req: AuthRequest,
  res: Response,
  next: NextFunction) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const data = await listSentEmails(req.user!.userId, page, limit);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function parseCsv(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'CSV file is required' });
      return;
    }
    const recipients = parseRecipientCsv(req.file.buffer);
    res.json({ count: recipients.length, recipients });
  } catch (err) {
    next(err);
  }
}
