declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.json' {
    const value: any;
    export default value;
}

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;
    readonly VITE_GOOGLE_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}