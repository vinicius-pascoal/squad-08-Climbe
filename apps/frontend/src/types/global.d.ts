import { ComponentCustomProperties } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: {
      info: (msg: string, timeout?: number) => void;
      success: (msg: string, timeout?: number) => void;
      warning: (msg: string, timeout?: number) => void;
      error: (msg: string, timeout?: number) => void;
    }
  }
}
export {};
