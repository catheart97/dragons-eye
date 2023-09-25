import { defineConfig, PluginOption } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

const fullReloadAlways: PluginOption = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" })
    return []
  },
} as unknown as PluginOption

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: {},
    }),
    fullReloadAlways
  ],
})
