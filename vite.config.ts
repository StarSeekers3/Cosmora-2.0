import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import orbitHandler from './api/orbits.ts';
import ntrsHandler from './api/ntrs.ts';

/** Serves the Vercel-style handlers in /api during `vite dev`, so local behaviour matches deployment. */
const localApi = (name: string, prefix: string, handler: typeof orbitHandler): Plugin => ({
  name,
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url?.startsWith(prefix)) return next();
      void handler(req, res).catch(error => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'API error' }));
      });
    });
  },
});

const localOrbitApi = localApi('local-orbit-api', '/api/orbits', orbitHandler);
const localNtrsApi = localApi('local-ntrs-api', '/api/ntrs', ntrsHandler);

export default defineConfig(() => {
  return {
    plugins: [localOrbitApi, localNtrsApi, react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    preview: { allowedHosts: true as const },
    server: {
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env VAR.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
