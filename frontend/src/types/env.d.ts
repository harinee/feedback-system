/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OKTA_ISSUER: string;
  readonly VITE_OKTA_CLIENT_ID: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
