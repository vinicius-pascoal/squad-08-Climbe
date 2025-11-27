import { app } from '../app';
import type { Request, Response } from 'express';
import { signAccessToken } from '../services/token.service';
import { usuarioRepo } from '../repositories/usuario.repo';
import { env } from '../config/env';
import { hashPassword } from '../utils/password';
import { randomUUID } from 'crypto';

const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || `http://localhost:${env.port}`;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || process.env.VITE_FRONTEND_URI || 'http://localhost:5173';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.OAUTH2_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.OAUTH2_SECRET || '';

function buildRedirectUri() {
  return `${BACKEND_ORIGIN.replace(/\/$/, '')}/oauth2callback`;
}

// Debug endpoint to check environment variables
app.get('/oauth-config', (_req: Request, res: Response) => {
  return res.json({
    backend_origin: BACKEND_ORIGIN,
    frontend_origin: FRONTEND_ORIGIN,
    redirect_uri: buildRedirectUri(),
    has_client_id: !!GOOGLE_CLIENT_ID,
    has_client_secret: !!GOOGLE_CLIENT_SECRET,
    env_vars: {
      BACKEND_ORIGIN: process.env.BACKEND_ORIGIN,
      FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
      NODE_ENV: process.env.NODE_ENV,
    }
  });
});

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
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/calendar.events',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent', // to get refresh_token each time in dev
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  console.log('[OAuth] Redirecting to Google with:', {
    redirect_uri: buildRedirectUri(),
    backend_origin: BACKEND_ORIGIN,
  });
  return res.redirect(authUrl);
});

// Step 2: callback
app.get('/oauth2callback', async (req: Request, res: Response) => {
  try {
    console.log('[OAuth] Callback received');
    const code = req.query.code as string | undefined;
    if (!code) {
      console.error('[OAuth] Missing code parameter');
      return res.status(400).send('Missing code');
    }

    console.log('[OAuth] Exchanging code for tokens...');
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
      console.error('[OAuth] Token exchange failed:', t);
      return res.status(500).send('OAuth token exchange failed');
    }
    console.log('[OAuth] Token exchange successful');
    const tokens = await tokenRes.json() as any;
    const accessToken = tokens.access_token as string;
    const idToken = tokens.id_token as string | undefined;

    console.log('[OAuth] Fetching user info from Google...');
    // Fetch userinfo
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) {
      const t = await userRes.text();
      console.error('[OAuth] Userinfo fetch failed:', t);
      return res.status(500).send('OAuth userinfo failed');
    }
    const profile = await userRes.json() as any;
    const email: string | undefined = profile?.email;
    const name: string | undefined = profile?.name;
    console.log('[OAuth] User info received:', { email, name });

    if (!email) {
      console.error('[OAuth] Email not available from Google profile');
      return res.status(400).send('Email não disponível pelo Google');
    }

    // Ensure local user exists
    console.log('[OAuth] Checking if user exists in database...');
    let user = await usuarioRepo.findByEmail(email);
    let isNewUser = false;
    
    if (!user) {
      console.log('[OAuth] Creating new user:', email);
      // Gera um hash aleatório impossível de adivinhar para usuários Google
      // Eles não usarão senha local, apenas OAuth
      const randomHash = await hashPassword(randomUUID());
      user = await usuarioRepo.create({
        email,
        nomeCompleto: name || email,
        situacao: 'pendente', // Novo usuário criado como pendente
        senhaHash: randomHash,
      });
      console.log('[OAuth] User created successfully with pending status:', user.id);
      isNewUser = true;
    } else {
      console.log('[OAuth] User already exists:', user.id);
    }

    // Verifica se usuário está pendente ou desativado
    const situacao = (String(user.situacao || '')).toLowerCase();
    if (situacao === 'pendente') {
      console.log('[OAuth] User is pending approval, redirecting to pending page');
      // Redireciona para página informando que está pendente
      const redirect = new URL(FRONTEND_ORIGIN.replace(/\/$/, '') + '/');
      redirect.searchParams.set('status', 'pending');
      redirect.searchParams.set('isNewUser', isNewUser ? 'true' : 'false');
      redirect.searchParams.set('email', email);
      return res.redirect(redirect.toString());
    }

    if (situacao === 'desativado') {
      console.log('[OAuth] User is deactivated');
      const redirect = new URL(FRONTEND_ORIGIN.replace(/\/$/, '') + '/');
      redirect.searchParams.set('status', 'deactivated');
      return res.redirect(redirect.toString());
    }

    // Issue our app JWT (now includes cargo and permissoes in payload)
    console.log('[OAuth] Generating JWT token...');
    const access_token = await signAccessToken(user.id);

    // Redirect to frontend with app access_token, user and google_access_token to use Calendar
    const redirect = new URL(FRONTEND_ORIGIN.replace(/\/$/, '') + '/auth');
    redirect.searchParams.set('access_token', access_token);
    redirect.searchParams.set('user', JSON.stringify({ id: user.id, nomeCompleto: user.nomeCompleto, email: user.email }));
    redirect.searchParams.set('google_access_token', accessToken);
    if (idToken) redirect.searchParams.set('google_id_token', idToken);

    console.log('[OAuth] Redirecting to frontend:', redirect.toString());
    return res.redirect(redirect.toString());
  } catch (err) {
    console.error('[OAuth] Callback error:', err);
    console.error('[OAuth] Error stack:', (err as Error)?.stack);
    return res.status(500).send(`OAuth error: ${(err as Error)?.message || 'Unknown error'}`);
  }
});
