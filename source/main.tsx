import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import "../resources/fonts/fira-code.css";
import "../resources/fonts/fira-sans.css";
import "../resources/fonts/fira-sans-condensed.css";
import "../resources/fonts/fira-sans-extra-condensed.css";
import "../resources/fonts/material-symbols.css";
import { Database, DatabaseSchema, GM5CompendiumJSON } from './data/Database';
import { TexturePool } from './data/TexturePool';
import { setupEnvironment } from './data/Environment';
import { App } from './App';

import WinCSS from "./win.index.css?raw"

let os : string;
const init = async () => {
  await TexturePool.getInstance().constructTexturePool();
  await setupEnvironment();
  await Database.setup();
  os = await window.ipcRenderer.invoke("m-os") as string;
  if (os == "win32") {
    const style = document.createElement("style");
    style.innerHTML = WinCSS;
    document.head.appendChild(style);
  }
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

const AppWrapper = () => {
  const [isMac, setIsMac] = React.useState<boolean>(os == "darwin");
  const initialized = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    window.ipcRenderer.on('r-full-screen', (_e, full) => {
      setIsMac(full ? false : os == "darwin");
    })
  }, [])

  return (
    <App isMac={isMac} />
  )
}

init().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <AppWrapper />
  )

  // Remove Preload scripts loading
  postMessage({ payload: 'removeLoading' }, '*')

  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
