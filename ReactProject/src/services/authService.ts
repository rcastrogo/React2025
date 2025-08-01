import PubSub from "../components/Pubsub";

const SECONS_IN_DAY = 24 *  60 * 60 * 1000;
const AUTH_TOKEN_KEY = 'reac-app-2025-authToken';
const AUTH_TOKEN_EXPIRATION = SECONS_IN_DAY * 1;
const AUTH_LOGIN_DELAY = 2 * 1000;

interface AuthToken {
  value: string;
  expiresAt: number; 
}

const authService = {
    isAuthenticated: false,

    isTokenValid(token:AuthToken | null) {
        return token && token.value && token.expiresAt > Date.now();
    },

    getStoredToken() : AuthToken | null {
        try {
            const stored = localStorage.getItem(AUTH_TOKEN_KEY);
            if (stored) {
                const token = JSON.parse(stored);
                return token;
            }
        } catch (e) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        return null;
    },

    storeToken(token:AuthToken) {
        try {
            localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
        } catch (e) {
            console.error("Error al guardar el token:", e);
        }
    },

    removeToken() {
        try {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        } catch (e) {
            console.error("Error al eliminar el token:", e);
        }
    },

    login(username:string, password:string): Promise<{ success: boolean, error?: string} > {
        return new Promise((resolve) => {

            setTimeout(() => {
                if (username === 'user' && password === '123') {
                    const token = {
                        value: 'dummy_jwt_token_12345',
                        expiresAt: Date.now() + AUTH_TOKEN_EXPIRATION,
                    };
                    this.storeToken(token);
                    this.isAuthenticated = true;
                    resolve({ success: true });
                    setTimeout(() => PubSub.publish(PubSub.messages.AUTH_LOGIN), AUTH_LOGIN_DELAY);
                } else {
                    this.isAuthenticated = false;
                    resolve({ success: false, error: 'Usuario o contraseña incorrectos.' });
                }
            }, 1000);
        });
    },

    logout() {
        this.removeToken();
        this.isAuthenticated = false;
        PubSub.publish(PubSub.messages.AUTH_LOGOUT);
    },

    checkAuth() {
        const token = this.getStoredToken();
        if (this.isTokenValid(token)) {
            this.isAuthenticated = true;
        } else {
            this.removeToken();
            this.isAuthenticated = false;
        }
        return this.isAuthenticated;
    }
};

export default authService;
