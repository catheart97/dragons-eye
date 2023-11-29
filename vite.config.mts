import { defineConfig, PluginOption } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import fsExtra from 'fs-extra'

const fullReloadAlways: PluginOption = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" })
    return []
  },
} as unknown as PluginOption

async function readFileAsBase64(filePath: string): Promise<string> {
  const ext = path.extname(filePath).slice(1);
  const buffer = await fsExtra.promises.readFile(filePath);
  const base64 = buffer.toString('base64');

  return `data:image/${ext};base64,${base64}`;
}

/** @type {import('vite').Plugin} */
const base64Plugin: PluginOption = {
  name: 'base64-loader',
  async transform(code, id) {
      const [path, query] = id.split('?');
      if (query != 'base64')
          return null;

     // load image file and convert to base64
      return `export default '${await readFileAsBase64(path)}';`;
  }
};

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
      renderer: {
      },
    }),
    fullReloadAlways,
    base64Plugin
  ],
  define: {
    APP_VERSION: JSON.stringify(require('./package.json').version),
  },
  build: {
    chunkSizeWarningLimit: 50000 
  }
})
