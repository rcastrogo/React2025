
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => {

    const env = loadEnv(mode, process.cwd(), '');

    console.log(process.cwd());
    console.log(env.VITE_APP_BASE_URL);

    return {
        plugins: [react()],
        base: env.VITE_APP_BASE_URL || '/',
        server: {
            proxy: {
                '/api2': {
                    target: 'https://localhost:7222',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                }
            }
        }
    }

});

