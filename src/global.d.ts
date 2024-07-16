declare module "*.less";
declare module '*.jpg';
declare module '*.png';
declare module '*.gif';
declare module '*.webm';
declare module '*.mp3';
declare module "*.svg" {
    const content: any;
    export default content;
}

declare global {
    interface Window {
        __passport?: string;
        __passport_verified?: string;
        __passport_with_key?: string;
    }
}