import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'images', dest: '.' },
        { src: 'config', dest: '.' },
      ],
    }),
  ],
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // Serve the workspace root as static so /images/ paths work
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
})
