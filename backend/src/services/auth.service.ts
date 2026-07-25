import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import User from '../models/User';
import type { JwtPayload } from '../types';

const client = new OAuth2Client(env.googleClientId);

export async function verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) {
    throw new Error('Invalid Google token');
  }
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email,
    avatarUrl: payload.picture ?? null,
  };
}

export async function findOrCreateUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}) {
  let user = await User.findOne({ where: { google_id: profile.googleId } });
  if (!user) {
    user = await User.create({
      google_id: profile.googleId,
      email: profile.email,
      name: profile.name,
      avatar_url: profile.avatarUrl,
    });
  }
  return user;
}

export function signJwt(userId: string, email: string): string {
  return jwt.sign({ userId, email } satisfies JwtPayload, env.jwtSecret, {
    expiresIn: env.expiresIn,
  });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
