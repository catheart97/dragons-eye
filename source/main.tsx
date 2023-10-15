import React from 'react'
import ReactDOM from 'react-dom/client'
import BoardApp from './BoardApp'

import './index.css'
import "../resources/fonts/fira-code.css";
import "../resources/fonts/fira-sans.css";
import "../resources/fonts/fira-sans-condensed.css";
import "../resources/fonts/fira-sans-extra-condensed.css";
import "../resources/fonts/material-symbols.css";
import { Database, DatabaseSchema, GM5CompendiumJSON } from './database/Database';
import { TexturePool } from './board/TexturePool';
import { setupEnvironment } from './database/Environment';

const init = async () => {
  await TexturePool.getInstance().constructTexturePool();
  await setupEnvironment();
  await Database.setup();
}

window.ipcRenderer.on('r-import-compendium', (_e, fn) => {
  const data = window.fsExtra.readJSONSync(fn);
  Database.getInstance().import(data as GM5CompendiumJSON);
  // window.ipcRenderer.send("m-reload");
})
window.ipcRenderer.on('r-import-database', (_e, fn) => {
  const data = window.fsExtra.readJSONSync(fn);
  Database.getInstance().importFromJSON(data as DatabaseSchema);
  window.ipcRenderer.send("m-reload");
})
window.ipcRenderer.on('r-export-database', (_e, fn) => {
  if (window.fsExtra.existsSync(fn)) {
    window.fsExtra.removeSync(fn);
  }
  window.fsExtra.writeJSONSync(fn, Database.getInstance().exportToJSON());
  console.log("Database exported to", fn);
})

init().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BoardApp />
    </React.StrictMode>,
  )

  // Remove Preload scripts loading
  postMessage({ payload: 'removeLoading' }, '*')

  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
