/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FORMSPREE_FORM_ID: string;
  readonly PUBLIC_GA_MEASUREMENT_ID: string;
  readonly PUBLIC_COOKIEBOT_DOMAIN_GROUP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    Cookiebot?: {
      consent?: {
        statistics?: boolean;
        marketing?: boolean;
        preferences?: boolean;
        necessary?: boolean;
      };
      renew?: () => void;
      show?: () => void;
    };
    __FTG_ANALYTICS__?: {
      measurementId: string;
      enabled: boolean;
    };
  }
}

export {};
