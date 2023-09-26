/// <reference types="vite/client" />

import { ipcRenderer } from 'electron';
import fsExtra from 'fs-extra';

declare global {
  interface Window {
    ipcRenderer: typeof ipcRenderer;
    fsExtra: typeof fsExtra;
  }
}

type License = {
  name: string;
  licenseType: string;
  author: string | "n/a";
  departement?: string;
  licensePeriod?: string;
  link?: string;
  remoteVersion?: string;
  installedVersion?: string;
  relatedTo?: string;
  definedVersion?: string;
}


declare module "**/licenses.json" {
  const value: License[];
  export default value;
}