import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(rootDir, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    rollupOptions: {
      preserveEntrySignatures: 'exports-only',
      treeshake: false,
      external: [
        'react',
        'react-dom',
        '@mantine/core',
        '@mantine/hooks'
      ],
      output: {
        exports: 'named'
      }
    }
  }
})
