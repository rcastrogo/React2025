import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
//import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    console.log(process.cwd());
    console.log(env.VITE_APP_BASE_URL);

    return {
        plugins: [
            react(),
            //VitePWA({
            //    registerType: 'autoUpdate',
            //    injectRegister: 'auto',
            //    workbox: {
            //        // Precaching de archivos estáticos
            //        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            //        // Reglas de caching en runtime para API
            //        runtimeCaching: [
            //            {
            //                urlPattern: ({ url }) => url.pathname.startsWith('/api/paises'),
            //                handler: 'CacheFirst',
            //                options: {
            //                    cacheName: 'paises-cache',
            //                    expiration: {
            //                        maxAgeSeconds: 60 * 60 * 24, // 24 horas
            //                    },
            //                },
            //            },
            //            {
            //                urlPattern: ({ url }) => url.pathname.startsWith('/api/monedas'),
            //                handler: 'CacheFirst',
            //                options: {
            //                    cacheName: 'monedas-cache',
            //                    expiration: {
            //                        maxAgeSeconds: 60 * 60 * 24, // 24 horas
            //                    },
            //                },
            //            },
            //        ],
            //    },
            //    manifest: {
            //        name: 'Mi PWA de Países y Monedas',
            //        short_name: 'Países & Monedas',
            //        theme_color: '#ffffff',
            //        icons: [
            //            {
            //                src: 'pwa-192x192.png',
            //                sizes: '192x192',
            //                type: 'image/png',
            //            },
            //            {
            //                src: 'pwa-512x512.png',
            //                sizes: '512x512',
            //                type: 'image/png',
            //            },
            //        ],
            //    },
            //}),
        ],
        base: env.VITE_APP_BASE_URL || '/',
        server: {
            proxy: {
                '/api2': {
                    target: 'https://localhost:7222',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    };
});