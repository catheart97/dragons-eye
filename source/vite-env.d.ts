/// <reference types="vite/client" />

import { ipcRenderer } from 'electron';
import fsExtra from 'fs-extra';

declare global {
  interface Window {
    ipcRenderer: typeof ipcRenderer;
    fsExtra: typeof fsExtra;
  }
}