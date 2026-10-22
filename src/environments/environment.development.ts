/**
 * Development settings (used by `ng serve`).
 * proxy.conf.json forwards /api/* to http://localhost:8087, so apiUrl stays empty.
 */
export const environment = {
  production: false,
  apiUrl: '',
  /** Admin uploads go straight to the API (same as apiUrl locally). */
  uploadApiUrl: ''
};
