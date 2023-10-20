import { app, BrowserWindow, dialog, HandlerDetails, ipcMain, Menu, MenuItem } from 'electron';
import path from 'node:path';
import NPMLicenses from '../license.json?raw';
import fsExtra from 'fs-extra';

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


const isProd = import.meta.env.PROD;

const buildLicense = (licenses: License[]) => {

    let output = `This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

SRD 5th Edition

The App contains some content from the SRD licensed by Open Game License v1.0a Copyright 2000, Wizards of the Coast, Inc..

Open Source License Notices

`
    for (const license of licenses) {
        if (license.author === "n/a") {
            output += `${license.name} (${license.licenseType}))\n`;
        } else {
            output += `${license.name} (${license.licenseType}) by ${license.author})\n`;
        }
    }
    return output;
}

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {

    ipcMain.handle("m-userData", (_event, _arg) => {
        const path = app.getPath("documents") + "/Dragon's Eye/";
        if (!fsExtra.existsSync(path)) {
            fsExtra.mkdirSync(path);
        }
        return path;
    });

    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        },
    })

    win.maximize()

    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(process.env.DIST, 'index.html'))
    }

    const menu = new Menu();
    menu.append(new MenuItem({
        label: "Dragon's Eye",
        submenu: [
            {
                label: 'About',
                role: 'about'
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                role: 'quit'
            },
        ]
    }));

    menu.append(new MenuItem({
        label: 'File',
        submenu: [
            {
                label: 'New',
                submenu: [
                    {
                        label: 'Board',
                        click: () => {
                            win!.webContents.send('r-new-board');
                        }
                    },
                    {
                        label: 'Campaign',
                        click: () => {
                            win!.webContents.send('r-new-campaign');
                        }
                    }
                ]
            },
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    const fn = dialog.showOpenDialogSync({
                        filters: [
                            { name: "Dragon's Eye Campaign", extensions: ['json', 'dec'] },
                            { name: "Dragon's Eye Board", extensions: ['json', 'deb'] },
                            { name: 'All Files', extensions: ['*'] }
                        ],
                        properties: ['openFile']
                    });

                    if (!fn) return;
                    win!.webContents.send('r-open-file', fn[0]);
                }
            },
            {
                label: 'Import',
                submenu: [
                    {
                        label: "Watabou's One Page Dungeon",
                        click: () => {
                            const fn = dialog.showOpenDialogSync({
                                filters: [
                                    { name: "Watabou's One Page Dungeon JSON", extensions: ['json'] },
                                    { name: 'All Files', extensions: ['*'] }
                                ],
                                properties: ['openFile']
                            });

                            if (!fn) return;

                            win!.webContents.send('r-import-onepagedungeon', fn[0]);
                            console.log("Importing " + fn[0]);
                        }
                    },
                    {
                        label: "GM5 JSON Compendium",
                        click: () => {
                            const fn = dialog.showOpenDialogSync({
                                filters: [
                                    { name: "GM5 JSON Compendium", extensions: ['json'] },
                                    { name: 'All Files', extensions: ['*'] }
                                ],
                                properties: ['openFile']
                            });

                            if (!fn) return;

                            win!.webContents.send('r-import-compendium', fn[0]);
                        }
                    },
                    {
                        label: "Dragon's Eye Database",
                        click: () => {
                            const fn = dialog.showOpenDialogSync({
                                filters: [
                                    { name: "Dragon's Eye Database", extensions: ['json'] },
                                    { name: 'All Files', extensions: ['*'] }
                                ],
                                properties: ['openFile']
                            });

                            if (!fn) return;

                            win!.webContents.send('r-import-database', fn[0]);
                        }
                    }
                ]
            },
            {
                label: 'Export',
                submenu: [
                    {
                        label: "Dragon's Eye Database",
                        click: () => {
                            const fn = dialog.showSaveDialogSync({
                                filters: [
                                    { name: "Dragon's Eye Database", extensions: ['json'] },
                                    { name: 'All Files', extensions: ['*'] }
                                ],
                                properties: ['createDirectory']
                            });
                            if (!fn) return;
                            win!.webContents.send('r-export-database', fn);
                        }
                    }
                ]
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => {
                    win?.webContents.send('r-save-file');
                }
            },
            {
                label: 'Save As',
                accelerator: 'CmdOrCtrl+Shift+S',
                click: () => {
                    const fn = dialog.showSaveDialogSync({
                        filters: [
                            { name: "Dragon's Eye Campaign", extensions: ['json', 'dec'] },
                            { name: "Dragon's Eye Board", extensions: ['deb', "json"] },
                            { name: 'All Files', extensions: ['*'] }
                        ],
                        properties: ['createDirectory']
                    });

                    if (!fn) return;

                    win!.webContents.send('r-save-file-as', fn);
                }
            }
        ]
    }));

    menu.append(new MenuItem({
        label: 'Edit',
        submenu: [
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Delete',
                accelerator: 'Delete',
                role: 'delete'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectAll'
            }
        ]
    }));

    menu.append(new MenuItem({
        label: 'View',
        submenu: [
            {
                label: "Show Player View",
                accelerator: 'CmdOrCtrl+P',
                click: () => {
                    win!.webContents.send('r-show-hide-player-view');
                }
            }
        ]
    }))

    if (!isProd) {
        menu.append(new MenuItem({
            label: 'Development',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    role: 'reload'
                },
                {
                    label: 'Toggle Development Tools',
                    accelerator: 'CmdOrCtrl+Alt+C',
                    role: 'toggleDevTools'
                }
            ]
        }));
    }
    Menu.setApplicationMenu(menu);

    const LicenseText = buildLicense([
        ...JSON.parse(NPMLicenses),
        {
            name: "Material Design Icons",
            licenseType: "Apache-2.0",
            author: "Google Inc."
        },
        {
            name: "Google Fonts",
            licenseType: "Apache-2.0",
            author: "Google Inc."
        }
    ])

    app.setAboutPanelOptions({
        "copyright": "Ronja Schnur (catheart97)",
        "credits": LicenseText
    })

    ipcMain.on("m-save-file-as", (_event, _arg) => {
        const fn = dialog.showSaveDialogSync({
            filters: [
                { name: "Dragon's Eye Campaign", extensions: ['dec', 'json'] },
                { name: "Dragon's Eye Board", extensions: ['deb', 'json'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['createDirectory']
        });
        if (!fn) return;
        win!.webContents.send('r-save-file-as', fn);
    });

    ipcMain.on("m-reload", (_event, _arg) => {
        win?.webContents.reload();
    });

    ipcMain.on("m-ready", (_event, _arg) => {
        if (fn != null) win!.webContents.send('r-open-file', fn);
    });

    win.webContents.setWindowOpenHandler((_arg: HandlerDetails) => {
        app.once('browser-window-created', (_event, newWindow) => {
            // newWindow.webContents.openDevTools();
            newWindow.setPosition(0, 0);
            newWindow.maximize();
        });

        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                webPreferences: {
                    sandbox: false,
                    contextIsolation: false,
                    nodeIntegration: true,
                    enableRemoteModule: false
                }
            }
        }
    })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

let fn: string | null = null;
app.on("open-file", (_event, arg) => {
    fn = arg;
    win?.webContents?.send('r-open-file', arg);
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(createWindow)
