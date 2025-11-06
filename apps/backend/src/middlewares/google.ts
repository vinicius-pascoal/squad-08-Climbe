import { app } from '../app';
import type { Request, Response } from 'express';
import { signAccessToken } from '../services/token.service';
import { usuarioRepo } from '../repositories/usuario.repo';
import { env } from '../config/env';

const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || `http://localhost:${env.port}`;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || process.env.VITE_FRONTEND_URI || 'http://localhost:5173';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.OAUTH2_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.OAUTH2_SECRET || '';

function buildRedirectUri() {
  return `${BACKEND_ORIGIN.replace(/\/$/, '')}/oauth2callback`;
}

// Step 1: redirect to Google OAuth consent
app.get('/login', (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: buildRedirectUri(),
    response_type: 'code',
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/calendar.events',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent', // to get refresh_token each time in dev
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return res.redirect(authUrl);
});

// Step 2: callback
app.get('/oauth2callback', async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string | undefined;
    if (!code) return res.status(400).send('Missing code');

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: buildRedirectUri(),
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      console.error('Token exchange failed:', t);
      return res.status(500).send('OAuth token exchange failed');
    }
    const tokens = await tokenRes.json() as any;
    const accessToken = tokens.access_token as string;
    const idToken = tokens.id_token as string | undefined;

    // Fetch userinfo
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) {
      const t = await userRes.text();
      console.error('Userinfo fetch failed:', t);
      return res.status(500).send('OAuth userinfo failed');
    }
    const profile = await userRes.json() as any;
    const email: string | undefined = profile?.email;
    const name: string | undefined = profile?.name;

    if (!email) return res.status(400).send('Email não disponível pelo Google');

    // Ensure local user exists (approve automatically to simplify)
    let user = await usuarioRepo.findByEmail(email);
    if (!user) {
      user = await usuarioRepo.create({
        email,
        nomeCompleto: name || email,
        situacao: 'aprovado',
      });
    }

    // Issue our app JWT (now includes cargo and permissoes in payload)
    const access_token = await signAccessToken(user.id);

    // Redirect to frontend with app access_token, user and google_access_token to use Calendar
    const redirect = new URL(FRONTEND_ORIGIN.replace(/\/$/, '') + '/auth');
    redirect.searchParams.set('access_token', access_token);
    redirect.searchParams.set('user', JSON.stringify({ id: user.id, nomeCompleto: user.nomeCompleto, email: user.email }));
    redirect.searchParams.set('google_access_token', accessToken);
    if (idToken) redirect.searchParams.set('google_id_token', idToken);

    return res.redirect(redirect.toString());
  } catch (err) {
    console.error('OAuth callback error', err);
    return res.status(500).send('OAuth error');
  }
});
