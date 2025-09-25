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
    const t: Toast = { id: _id++, ...toast };
    this.list.push(t);
    if (t.timeout > 0) {
      setTimeout(() => {
        const idx = this.list.findIndex(x => x.id === t.id);
        if (idx !== -1) this.list.splice(idx, 1);
      }, t.timeout);
    }
  },
  remove(id: number) {
    const idx = this.list.findIndex(t => t.id === id);
    if (idx !== -1) this.list.splice(idx, 1);
  }
});

export const ToastPlugin = {
  install(app: App) {
    const api = {
      info(message: string, timeout = 3000) { toastStore.add({ message, type: 'info', timeout }); },
      success(message: string, timeout = 3000) { toastStore.add({ message, type: 'success', timeout }); },
      warning(message: string, timeout = 4000) { toastStore.add({ message, type: 'warning', timeout }); },
      error(message: string, timeout = 5000) { toastStore.add({ message, type: 'error', timeout }); },
    };
    // expose as $toast
    // @ts-ignore
    app.config.globalProperties.$toast = api;
    // also export on window for non-Vue scripts if needed
    // @ts-ignore
    (window as any).__toast = api;
  }
};

export default ToastPlugin;
