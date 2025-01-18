import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import basicSsl from '@vitejs/plugin-basic-ssl'
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    solidPlugin(),
    basicSsl({
      /** name of certification */
      name: 'test',
      /** custom trust domains */
      domains: ['*.custom.com'],
      /** custom certification directory */
      certDir: '/Users/.../.devServer/cert'
    })
  ],
  start: {
    ssr: true,
    server: {
      baseURL: process.env.BASE_PATH,
      preset: "static"
    }
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
