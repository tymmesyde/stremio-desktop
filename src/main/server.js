const config = require('./config');
const torrentStream = require('torrent-stream');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const parseRange = require('range-parser');
const pump = require('pump');
const app = express();

let server = null;

app.use(cors({
    origin: 'stremio-desktop://-'
}));
app.use(bodyParser.json());

function createEngine(infoHash, options) {
    return new Promise(resolve => {
        const engine = torrentStream(`magnet:?xt=urn:btih:${infoHash}`, options);
        engine.on('ready', () => resolve(engine));
    });
}

app.all('/:infoHash([a-f0-9]{40})/create', async (req, res) => {
    const { infoHash } = req.params;
    const options = req.body;

    const { torrent } = await createEngine(infoHash, options);
    res.json(torrent);
});

app.get('/:infoHash([a-f0-9]{40})/:index', async (req, res) => {
    const { infoHash, index } = req.params;

    const engine = await createEngine(infoHash);
    const file = engine.files[index];

    res.setHeader('Accept-Ranges', 'bytes');
    // res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Cache-Control', 'max-age=0, no-cache');

    if (!req.headers.range) {
        res.setHeader('Content-Length', file.length);
        if (req.method === 'HEAD') return res.end();
        pump(file.createReadStream(), res);
        return;
    }

    const [{ start, end }] = parseRange(file.length, req.headers.range);

    res.statusCode = 206;
    res.setHeader('Content-Length', end - start + 1);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${file.length}`);

    if (req.method === 'HEAD') return res.end();
    pump(file.createReadStream({ start, end }), res);
});

app.get('/settings', (req, res) => {
    res.json({
        baseUrl: `http://127.0.0.1:${config.serverPort}`,
        options: [],
        values:{
            appPath: '',
            cacheRoot: '',
            cacheSize: 0,
            btMaxConnections: 35,
            btHandshakeTimeout: 20000,
            btRequestTimeout: 4000,
            btDownloadSpeedSoftLimit: 1677721.6,
            btDownloadSpeedHardLimit: 2621440,
            btMinPeersForStable: 5,
            remoteHttps: '',
            localAddonEnabled: false,
            serverVersion: `stremio-desktop-server@${config.version}`
        }
    });
});

app.post('/settings', req => {
    const { body } = req.body;
    console.log(body);
});

function start() {
    return new Promise(resolve => server = app.listen(config.serverPort, () => resolve()));
}

function stop() {
    if (server) server.close();
}

module.exports = {
    start,
    stop
};