const isProduction = import.meta.env.VITE_ENV_TYPE === "production";

export const API_URL = isProduction
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_DEV_API_URL;

export const VIEW_UPLOADED_FILE_URL = isProduction
  ? import.meta.env.VITE_UPLOAD_URL
  : import.meta.env.VITE_DEV_UPLOAD_URL;