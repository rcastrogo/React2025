

export const APP_VERSION = import.meta.env.VITE_APP_VERSION || import.meta.env.npm_package_version || 'Desconocida';
export const APP_BASENAME = import.meta.env.VITE_APP_BASE_URL || '/';
export const APP_SPLASH_TIME = 5000;
export const APP_SPLASH_SUBTITLE = 'Cargando la magia...';
export const APP_SPLASH_TITLE = 'React-App';
export const APP_SPLASH_FOOTER = 'Rafael Castro Gómez 2025';
export const APP_SPLASH_IMAGE = 'https://icon.icepanel.io/Technology/svg/Vite.js.svg';
export const APP_DEV = window.location.hostname.toLowerCase() === 'localhost';

/**
 * Número de segundos en un día, multiplicado por 1000 para obtener milisegundos.
 * Útil para cálculos de expiración basados en días.
 */
export const SECONS_IN_DAY = 24 * 60 * 60 * 1000;

/**
 * Clave utilizada para almacenar el token de autenticación en el almacenamiento local (localStorage o sessionStorage).
 */
export const AUTH_TOKEN_KEY = 'authToken';

/**
 * Duración de la validez del token de autenticación en milisegundos.
 * En este caso, el token expira después de 1 día.
 */
export const AUTH_TOKEN_EXPIRATION = SECONS_IN_DAY * 1;

/**
 * Retraso en milisegundos antes de intentar el inicio de sesión automático o alguna acción post-login.
 * Útil para dar tiempo a que la UI se renderice o animaciones se completen.
 */
export const AUTH_LOGIN_DELAY = 2 * 1000;

export const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    TEXT: 'text', 
} as const;

/**
 * Objeto que agrupa todas las constantes relacionadas con la autenticación.
 * Facilita la importación y organización de estas constantes.
 */
export const AUTH = { 
    SECONS_IN_DAY,
    AUTH_TOKEN_KEY,
    AUTH_TOKEN_EXPIRATION,
    AUTH_LOGIN_DELAY
};

