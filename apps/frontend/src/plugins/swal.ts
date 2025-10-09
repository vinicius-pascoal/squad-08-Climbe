import type { App } from 'vue';
import Swal, { type SweetAlertIcon, type SweetAlertOptions, type SweetAlertResult } from 'sweetalert2';

type Notify = {
  info: (msg: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
  success: (msg: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
  warning: (msg: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
  error: (msg: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
  confirm: (title: string, text?: string, confirmButtonText?: string) => Promise<SweetAlertResult>;
};

export default {
  install(app: App) {
    const baseToast = (icon: SweetAlertIcon, title: string, opts: SweetAlertOptions = {}) => {
      return Swal.fire({
        toast: true,
        icon,
        title,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        ...opts
      });
    };

    const notify: Notify = {
      info: (msg, opts) => baseToast('info', msg, opts),
      success: (msg, opts) => baseToast('success', msg, opts),
      warning: (msg, opts) => baseToast('warning', msg, opts),
      error: (msg, opts) => baseToast('error', msg, opts),
      confirm: (title, text, confirmButtonText = 'Confirmar') => Swal.fire({
        icon: 'question',
        title,
        text,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Cancelar'
      }),
    };

    (app.config.globalProperties as any).$swal = Swal;
    (app.config.globalProperties as any).$notify = notify;

    // Qualquer window.alert vira MODAL CENTRAL
    (window as any).alert = (msg?: any) => Swal.fire({
      icon: 'info',
      text: String(msg),
      position: 'center',
      toast: false,
      confirmButtonText: 'OK'
    });
  }
};