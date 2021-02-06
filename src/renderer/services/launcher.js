import axios from 'axios';

const stremioWebReleases = 'https://api.github.com/repos/Stremio/stremio-web/releases';

export default {

    electron: window.electron,

    getInstalledVersion() {
        return this.electron.getInstalledVersion();
    },
    
    async getReleases() {
        try {
            const { data } = await axios.get(stremioWebReleases);
            return data
                .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
                .map(({  name, assets }) => ({
                    name,
                    url: assets[0].browser_download_url
                }));
        } catch(_) {
            return [];
        }
    },

    installRelease(release) {
        return this.electron.installRelease(release.name, release.url);
    },

    launchStremio() {
        return this.electron.launchStremio();
    },

    startServer() {
        return this.electron.startServer();
    }

}