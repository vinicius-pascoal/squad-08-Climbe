import type { ComponentCustomProperties } from 'vue';
import type Swal from 'sweetalert2';
import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $swal: typeof Swal;
    $notify: {
      info: (msg: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
      success: (msg: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
      warning: (msg: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
      error: (msg: string, opts?: SweetAlertOptions) => Promise<SweetAlertResult>;
      confirm: (title: string, text?: string, confirmButtonText?: string) => Promise<SweetAlertResult>;
    };
  }
}
export {};
