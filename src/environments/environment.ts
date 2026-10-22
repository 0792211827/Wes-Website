/**
 * Production settings (used by `ng build`).
 * apiUrl is empty because vercel.json forwards /api/* to the Spring Boot API on Render,
 * so the browser talks to the same origin (no CORS needed).
 * If you host the API elsewhere without the rewrite, put its full URL here,
 * e.g. 'https://wesportfolio-api.onrender.com'.
 */
export const environment = {
  production: true,
  apiUrl: ''
};
