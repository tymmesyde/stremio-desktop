const packager = require('electron-packager');

packager({
    dir: 'dist',
    out: 'out',
    overwrite: true,
    asar: true,
    name: 'Stremio Desktop',
    icon: 'src/res/icon.ico'
});