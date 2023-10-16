/// <reference types="vite/client" />

import { ipcRenderer } from 'electron';
import fsExtra from 'fs-extra';

declare global {
  interface Window {
    ipcRenderer: typeof ipcRenderer;
    fsExtra: typeof fsExtra;
    userData: () => Promise<string>
  }

  declare module "*.png?base64" {
    const value: string;
    export default value;
  }
  
  declare module "*.jpg?base64" {
    const value: string;
    export default value;
  }
  
  declare module "*.jpeg?base64" {
    const value: string;
    export default value;
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

declare module "*.png?base64" {
  const value: string;
  export default value;
}

declare module "*.jpg?base64" {
  const value: string;
  export default value;
}

declare module "*.jpeg?base64" {
  const value: string;
  export default value;
}