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
    // Cores do mockup para cada tipo e tema
    const toastColors = {
      light: {
        success: { background: '#bbf7d0', color: '#166534', iconColor: '#22c55e' },
        error: { background: '#fddede', color: '#b91c1c', iconColor: '#ef4444' },
        warning: { background: '#ffddad', color: '#b45309', iconColor: '#f59e0b' },
        info: { background: '#cad7ff', color: '#1e40af', iconColor: '#2563eb' },
      },
      dark: {
        success: { background: '#14532d', color: '#bbf7d0', iconColor: '#22c55e' },
        error: { background: '#7f1d1d', color: '#fca5a5', iconColor: '#ef4444' },
        warning: { background: '#78350f', color: '#fde68a', iconColor: '#f59e0b' },
        info: { background: '#1e293b', color: '#93c5fd', iconColor: '#38bdf8' },
      }
    };

    function getTheme() {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }

    const baseToast = (icon: SweetAlertIcon, title: string, opts: SweetAlertOptions = {}) => {
      const theme = getTheme();
      const colorSet = toastColors[theme][icon] || toastColors[theme].info;
      return Swal.fire({
        toast: true,
        icon,
        title,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: colorSet.background,
        color: colorSet.color,
        iconColor: colorSet.iconColor,
        customClass: {
          popup: 'swal2-toast-custom',
          title: 'swal2-toast-title-custom',
        },
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

    // Estilos customizados para o toast
    const styleId = 'swal2-toast-theme-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .swal2-toast-custom {
          border-radius: 12px !important;
          box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10);
          min-width: 320px;
          max-width: 400px;
        }
        .swal2-toast-title-custom {
          font-weight: 600;
          font-size: 1.05rem;
        }
        .swal2-popup.swal2-toast .swal2-close {
          color: inherit;
        }
      `;
      document.head.appendChild(style);
    }

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
