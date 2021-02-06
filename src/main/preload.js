const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getInstalledVersion: () => ipcRenderer.invoke('getInstalledVersion'),
    installRelease: (name, url) => ipcRenderer.invoke('installRelease', name, url),
    launchStremio: () => ipcRenderer.invoke('launchStremio'),
    stopServer: () => ipcRenderer.invoke('stopServer'),
    startServer: () => ipcRenderer.invoke('startServer')
});