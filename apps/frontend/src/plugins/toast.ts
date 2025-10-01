import type { App } from 'vue';
import { reactive } from 'vue';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  timeout: number;
}

let _id = 1;

export const toastStore = reactive({
  list: [] as Toast[],
  add(toast: Omit<Toast, 'id'>) {
    const id = _id++;
    const full: Toast = { id, ...toast };
    this.list.push(full);
    if (full.timeout > 0) {
      setTimeout(() => {
        this.remove(id);
      }, full.timeout);
    }
  },
  remove(id: number) {
    const i = this.list.findIndex(t => t.id === id);
    if (i >= 0) this.list.splice(i, 1);
  },
  clear() {
    this.list = [];
  }
});

export type ToastAPI = {
  info: (message: string, timeout?: number) => void;
  success: (message: string, timeout?: number) => void;
  warning: (message: string, timeout?: number) => void;
  error: (message: string, timeout?: number) => void;
};

export const useToast = (): ToastAPI => ({
  info(message: string, timeout = 2500)    { toastStore.add({ message, type: 'info',    timeout }); },
  success(message: string, timeout = 3000) { toastStore.add({ message, type: 'success', timeout }); },
  warning(message: string, timeout = 4000) { toastStore.add({ message, type: 'warning', timeout }); },
  error(message: string, timeout = 5000)   { toastStore.add({ message, type: 'error',   timeout }); },
});

const ToastPlugin = {
  install(app: App) {
    const api = useToast();
    // expose as $toast
    // @ts-ignore
    app.config.globalProperties.$toast = api;
    // also export on window for non-Vue scripts if needed
    // @ts-ignore
    (window as any).__toast = api;
  }
};

export default ToastPlugin;