module.exports = {
    outputDir: 'dist/renderer',
    pages: {
        index: {
            title: 'Stremio Desktop',
            entry: 'src/renderer/main.js',
            template: 'src/res/index.html'
        }
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => ({
                ...options,
                compilerOptions: {
                    isCustomElement: (tag) => tag === 'ion-icon'
                }
            }));
    }
};