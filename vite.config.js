import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Prevents developers from inspecting original .jsx source files in browser DevTools
    minify: 'esbuild', // Minifies and obfuscates bundle variable & function names
    cssMinify: true,
  },
})
