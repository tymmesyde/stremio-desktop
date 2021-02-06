const path = require('path');
const { version } = require('../../package.json');

const homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const installDir = path.resolve(homePath, '.stremio-desktop');

module.exports = {
    version,
    installDir: installDir,
    versionFile: path.join(installDir, 'version'),
    serverPort: 11470
};