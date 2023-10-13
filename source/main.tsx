import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './index.css'
import "../resources/fonts/fira-code.css";
import "../resources/fonts/fira-sans.css";
import "../resources/fonts/fira-sans-condensed.css";
import "../resources/fonts/fira-sans-extra-condensed.css";
import "../resources/fonts/material-symbols.css";
import { Database } from './database/Database';
import { TexturePool } from './board/TexturePool';
import { setupEnvironment } from './database/Environment';

const init = async () => {
  await TexturePool.getInstance().constructTexturePool();
  await setupEnvironment();
  await Database.setup();
}

init().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

  // Remove Preload scripts loading
  postMessage({ payload: 'removeLoading' }, '*')

  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
