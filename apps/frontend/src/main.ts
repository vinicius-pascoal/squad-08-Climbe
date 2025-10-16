import "./styles/colors.css";
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import SwalPlugin from './plugins/swal';

const app = createApp(App).use(router);
app.use(SwalPlugin);
app.mount('#app');
