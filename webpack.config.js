const path = require('path');
const CreateFileWebpack = require('create-file-webpack');

module.exports = [
    {
        mode: 'production',
        target: 'electron-main',
        entry: {
            main: path.join(__dirname, './src/main/index.js')
        },
        output: {
            path: path.join(__dirname, './dist'),
            filename: 'main.js'
        },
        node: {
            __dirname: false,
        },
        plugins: [
            new CreateFileWebpack({
                path: path.join(__dirname, 'dist'),
                fileName: 'package.json',
                content: JSON.stringify({
                    main: 'main.js'
                })
            })
        ]
    },
    {
        mode: 'production',
        entry: path.join(__dirname, './src/main/preload.js'),
        target: 'electron-preload',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'preload.js'
        }
    }
];