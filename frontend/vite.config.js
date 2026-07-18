import { defineConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    
  ],
   build: {
    // Raises the warning threshold to 1MB
    chunkSizeWarningLimit: 1000,
  },
})

