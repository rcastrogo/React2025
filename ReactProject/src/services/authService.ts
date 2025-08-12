import PubSub from "../components/Pubsub";
import { appConfig } from "./configService";
import {AUTH, AUTH_LOGIN_DELAY } from "../constants/appConfig";

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
            const stored = appConfig.read(AUTH.AUTH_TOKEN_KEY);
            if (stored) {
                const token = JSON.parse(stored);
                return token;
            }
        } catch (e) {
            appConfig.remove(AUTH.AUTH_TOKEN_KEY);
        }
        return null;
    },
    storeToken(token:AuthToken) {
        try {
            appConfig.write(AUTH.AUTH_TOKEN_KEY, JSON.stringify(token));
        } catch (e) {
            console.error("Error al guardar el token:", e);
        }
    },
    removeToken() {
        try {
            appConfig.remove(AUTH.AUTH_TOKEN_KEY);
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
                        expiresAt: Date.now() + AUTH.AUTH_TOKEN_EXPIRATION,
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
