import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import markdownPlugin from './src/blog/markdown-plugin'

export default defineConfig({
  plugins: [markdownPlugin(), react()],
  base: '/',
  resolve: {
    alias: {
      '@aiviz/shared': path.resolve(__dirname, '../shared'),
    },
  },
})
