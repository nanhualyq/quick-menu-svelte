/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANKI_DEFAULT_HOST: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
