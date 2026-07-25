import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../services/auth.service';
import type { JwtPayload } from '../types';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const token = header.slice(7);
    req.user = verifyJwt(token);
    next();
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
  });
  }
}
