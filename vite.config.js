import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/temporary/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve('', 'index.html'),
        mainApp: resolve('', 'c3a32ad71e0723f8d63d3594b986acccb735c4f2/index.html')
      }
    }
  },
  server: {
    fs: {
      allow: ['..',]
    }
  },
})