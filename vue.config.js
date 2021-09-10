module.exports = {
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0',
        proxy: {
            '/apps': {
                target: 'http://0.0.0.0:8770/backend',
                changeOrigin: true,
                pathRewrite: {
                    '/apps': ''
                }
            }
        }
    }

};
