import react from '@vitejs/plugin-react-swc'
import env from 'vite-plugin-env-compatible'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), env()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [],
    },
  },
  define: {
    'process.env': {
      VITE_GOOGLE_MEASUREMENT_ID: JSON.stringify(
        process.env.VITE_GOOGLE_MEASUREMENT_ID
      ),
      VITE_PLAUSIBLE_DOMAIN: JSON.stringify(process.env.VITE_PLAUSIBLE_DOMAIN),
    },
  },
})
