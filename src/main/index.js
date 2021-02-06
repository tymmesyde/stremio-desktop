const path = require('path');
const { app, BrowserWindow, nativeImage, ipcMain } = require('electron');
const serve = require('electron-serve');
const windowStateKeeper = require('electron-window-state');

const updater = require('./updater');
const server = require('./server');
const { installDir } = require('./config');

try {
	require('electron-reloader')(module, {
        watchRenderer: false
    });
} catch (_) {}

const { port } = require('minimist')(process.argv.slice(2));
const isDev = port ? true : false;

const icon = nativeImage.createFromPath(path.join(__dirname, '../res/icon.ico'));

const loadURL = serve({ scheme: 'stremio-updater', directory: 'renderer' });
const loadDesktopURL = serve({ scheme: 'stremio-desktop', directory: path.join(installDir, 'build') });

let launcherWindow = null;
function createWindow() {
    launcherWindow = new BrowserWindow({
        width: 500,
        height: 550,
        resizable: false,
        fullscreenable: false,
        backgroundColor: '#0e0d1e',
        title: 'Stremio Desktop',
        icon,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    launcherWindow.setMenu(null);
    if (isDev) launcherWindow.webContents.openDevTools();

    isDev ? launcherWindow.loadURL(`http://localhost:${port}`) : loadURL(launcherWindow);
}

async function launchStremio() {
    const mainWindowState = windowStateKeeper({
        defaultWidth: 1200,
        defaultHeight: 700
    });

    const { width, height, x, y } = mainWindowState;
    const win = new BrowserWindow({
        width,
        height,
        x,
        y,
        icon
    });

    win.setMenu(null);
    if (isDev) win.webContents.openDevTools();

    mainWindowState.manage(win);
    
    await loadDesktopURL(win);

    launcherWindow.hide();
    win.on('closed', () => {
        server.stop();
        launcherWindow.show();
    });
}

app.whenReady()
    .then(createWindow);

app.on('window-all-closed', async () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('launchStremio', () => launchStremio());

ipcMain.handle('getInstalledVersion', () => updater.getInstalledVersion());
ipcMain.handle('installRelease', (event, name, url) => updater.installRelease(name, url));

ipcMain.handle('startServer', () => server.start());