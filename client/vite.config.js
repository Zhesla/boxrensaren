import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' gör att bygget fungerar även på GitHub Pages i en undermapp
export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    environment: 'node',
  },
})
