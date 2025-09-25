import ToastPlugin from './plugins/toast';
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
const app = createApp(App).use(router);
app.use(ToastPlugin);
// Override window.alert to use toast
(window as any).alert = (msg?: any) => { (app.config.globalProperties as any).$toast.info(String(msg)); };
app.mount('#app');
