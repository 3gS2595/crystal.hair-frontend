import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue'
import path from 'path'


export default defineConfig({
  base: './',
  plugins: [
    vue(),
    visualizer({ open: true }), // Generates a visual report
  ],
  server: {
    host: '0.0.0.0',  // listen on all interfaces
    port: 80,
  },
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // <-- THIS LINE
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Split vendor libraries
          }
          if (id.includes('src/components/')) {
            return 'components'; // Split components into their own chunk
          }
        },
      },
    },
  },
})
