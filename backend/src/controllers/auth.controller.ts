import { Request, Response, NextFunction } from 'express';
import {
  verifyGoogleToken,
  findOrCreateUser,
  signJwt,
} from '../services/auth.service';

export async function googleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { idToken } = req.body as { idToken?: string };
    if (!idToken) {
      res.status(400).json({ error: 'idToken is required' });
      return;
    }
    const profile = await verifyGoogleToken(idToken);
    const user = await findOrCreateUser(profile);
    const token = signJwt(user.id, user.email);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (err) {
    next(err);
  }
}
