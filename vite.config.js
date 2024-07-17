import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/temporary/",
  publicDir: "../public",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve('', 'index.html'),
        mainApp: resolve('', 'index.html')
      }
    }
  },
  server: {
    fs: {
      allow: ['..',]
    }
  },
})