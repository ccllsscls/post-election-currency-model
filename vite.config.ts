import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/post-election-currency-model/',
  plugins: [react()],
})