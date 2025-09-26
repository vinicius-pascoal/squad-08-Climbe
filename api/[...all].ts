// Vercel catch-all API function that proxies all /api/* (and rewrites we add)
// to the existing Express app bundled in apps/backend.

// Import the compiled Express app from the backend build output
// (built during Vercel's buildCommand).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const backend = require('../apps/backend/dist/app');
const app = backend.app || backend.default || backend;

export default function handler(req: any, res: any) {
  return (app as any)(req, res);
}
