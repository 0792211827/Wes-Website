/**
 * Production settings (used by `ng build`).
 * apiUrl is empty because vercel.json forwards /api/* to the Spring Boot API on Render,
 * so the browser talks to the same origin (no CORS needed).
 * If you host the API elsewhere without the rewrite, put its full URL here,
 * e.g. 'https://wesportfolio-api.onrender.com'.
 */
export const environment = {
  production: true,
  apiUrl: '',
  /**
   * Admin uploads (profile photo, CV) go straight to the Render API: Vercel's proxy limits request
   * bodies to about 4.5 MB. The API's CORS_ORIGINS must include this site (https://*.vercel.app is allowed by default).
   */
  uploadApiUrl: 'https://backendwesly.onrender.com'
};
