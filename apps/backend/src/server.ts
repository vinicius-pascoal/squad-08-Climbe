import { app } from './app';
import { env } from './config/env';

<<<<<<< Updated upstream
app.listen(env.port, () => {
  console.log(`API rodando na porta ${env.port}`);
=======
app.listen(env.port, '0.0.0.0', () => {
  console.log(`Backend on http://0.0.0.0:${env.port}`);
>>>>>>> Stashed changes
});
