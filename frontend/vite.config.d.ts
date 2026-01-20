/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // другие env переменные...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
