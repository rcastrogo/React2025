import { useState, useEffect, useCallback } from 'react';


interface AuthToken {
  value: string;
  expiresAt: number; 
}

const AUTH_TOKEN_KEY = 'reac-app-2025-authToken';
const AUTH_TOKEN_EXPIRATION = (1 * 30 * 1000)

function useAuth() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isTokenValid = (token: AuthToken | null): boolean => {
    if (!token || !token.value || !token.expiresAt) {
      return false;
    }
    return Date.now() < token.expiresAt;
  };

  const getStoredToken = (): AuthToken | null => {
    try {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) {
        const token: AuthToken = JSON.parse(storedToken);
        return token;
      }
    } catch(e) {
      localStorage.removeItem(AUTH_TOKEN_KEY); 
    }
    return null;
  };

  const storeToken = (token: AuthToken) => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
    } catch (e) {
      console.error("Error al guardar el token en localStorage:", e);
    }
  };

  const removeToken = () => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.error("Error al eliminar el token de localStorage:", e);
    }
  };

  const login = (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // --- SIMULACIÓN DE LLAMADA AL BACKEND ---
      // En una aplicación real, aquí harías un fetch/axios a tu API de login
      // Ejemplo: const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) });
      // const data = await response.json();    

      if (username === 'user' && password === '123') {
        const newToken: AuthToken = {
          value: 'dummy_jwt_token_12345',
          expiresAt: Date.now() + AUTH_TOKEN_EXPIRATION
        };
        storeToken(newToken);
        setIsAuthenticated(true);
        return true; 
      } else {
        setError('Usuario o contraseña incorrectos.');
        setIsAuthenticated(false);
        return false;
      }
    } catch (err) {
      console.error("Error en la operación de login:", err);
      setError('Ocurrió un error al intentar iniciar sesión.');
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    window.location.href = '/'; 
  };


  useEffect(() => {
    const token = getStoredToken();
    if (isTokenValid(token)) {
      setIsAuthenticated(true);
    } else {
      removeToken();
      setIsAuthenticated(false);
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}

export default useAuth;