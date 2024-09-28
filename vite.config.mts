import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
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
  resolve: {
    alias: {
      '@modals': resolve(__dirname, 'src/components/modals'),
      '@ui': resolve(__dirname, 'src/components'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@context': resolve(__dirname, 'src/context'),
      '@': resolve(__dirname, 'src'),
    },
  },
})
