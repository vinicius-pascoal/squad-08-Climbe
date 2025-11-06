(async () => {
  try {
    const base = 'http://localhost:3000';
    const loginRes = await fetch(base + '/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'password', username: 'admin@climbe.local', password: 'admin12345' })
    });
    const loginJson = await loginRes.json();
    console.log('AUTH RESPONSE:');
    console.log(JSON.stringify(loginJson, null, 2));
    const token = loginJson.access_token;
    if (!token) { process.exit(1); }
    // Decode token locally to inspect payload (requires JWT_SECRET present in env)
    try {
      const jwt = require('jsonwebtoken');
      const secret = process.env.JWT_SECRET || 'dev-secret';
      const decoded = jwt.verify(token, secret);
      console.log('\nDECODED TOKEN PAYLOAD:');
      console.log(JSON.stringify(decoded, null, 2));
    } catch (e) {
      console.error('Failed to decode token locally:', e.message || e);
    }

    // Also attempt /api/me to mimic frontend (may return HTML if static server overrides)
    try {
      const meRes = await fetch(base + '/api/me/', { headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' } });
      const contentType = meRes.headers.get('content-type') || '';
      console.log('\nME STATUS:', meRes.status);
      if (contentType.includes('application/json')) {
        const meJson = await meRes.json();
        console.log('\nME RESPONSE:');
        console.log(JSON.stringify(meJson, null, 2));
      } else {
        const txt = await meRes.text();
        console.log('\nME NON-JSON RESPONSE (first 800 chars):');
        console.log(txt.slice(0, 800));
      }
    } catch (e) {
      console.error('Error calling /api/me:', e);
    }
  } catch (e) {
    console.error('ERROR', e);
    process.exit(1);
  }
})();
