import "./styles/colors.css";
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import SwalPlugin from './plugins/swal';
import { initAuth } from './services/auth';

const app = createApp(App).use(router);
app.use(SwalPlugin);

// Inicializa informações do usuário (chama GET /api/me) antes de montar a app
initAuth().finally(() => {
  app.mount('#app');
});
