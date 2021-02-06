const fs = require('fs');
const axios = require('axios');
const unzipper = require('unzipper');
const { installDir, versionFile } = require('./config');

function getInstalledVersion() {
    if (fs.existsSync(versionFile)) {
        const version = fs.readFileSync(versionFile).toString();
        return version ? version : null;
    }
    return null;
}

async function installRelease(name, url) {
    const { data } = await axios({
        method: 'get',
        url,
        responseType: 'stream'
    });

    await data.pipe(unzipper.Extract({ path: installDir })).promise();
    fs.writeFileSync(versionFile, name);
}

module.exports = {
    getInstalledVersion,
    installRelease
};