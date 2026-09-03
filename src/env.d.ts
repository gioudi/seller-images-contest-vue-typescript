/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALEGRA_API_KEY?: string;
  readonly VITE_ALEGRA_BASE_URL?: string;
  readonly VITE_UNSPLASH_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
