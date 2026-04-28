import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // Only copy static assets during build — in dev, Vite serves them directly
    // via server.fs.allow. viteStaticCopy's directory watcher in dev mode
    // interferes with `?raw` imports (e.g. /config/nav.yml?raw).
    ...(command === 'build'
      ? [
          viteStaticCopy({
            targets: [
              { src: 'images', dest: '.' },
              { src: 'config', dest: '.' },
            ],
          }),
        ]
      : []),
  ],
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // Serve the workspace root as static so /images/ and /config/ paths work in dev
  server: {
    fs: {
      allow: ['.'],
    },
  },
  assetsInclude: ['**/*.md'],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}))
