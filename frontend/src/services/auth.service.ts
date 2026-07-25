import api from './api';
import type { User } from '../types/user';

export async function loginWithGoogle(idToken: string): Promise<{ token: string; user: User }> {
  const { data } = await api.post<{ token: string; user: User }>('/auth/google', { idToken });
  return data;
}
