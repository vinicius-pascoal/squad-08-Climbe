import { http } from '../lib/http';

export type LoginInput = { username: string; password: string };
export type LoginResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: { id: number; nomeCompleto: string; email: string };
};

export function loginApi(input: LoginInput) {
  return http<LoginResponse>('/api/auth/token', {
    method: 'POST',
    body: JSON.stringify({ grant_type: 'password', ...input }),
  });
}
