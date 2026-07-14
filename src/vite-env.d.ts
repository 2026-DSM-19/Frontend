/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SAFE_MAP_API_TOKEN?: string;
  readonly VITE_V_WORLD_API_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
