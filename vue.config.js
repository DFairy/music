const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    chainWebpack(config) {
        config.resolve.alias
            .set('components', resolve('src/components'))
            .set('views', resolve('src/views'))
            .set('common', resolve('src/common'))
            .set('api', resolve('src/api'))
            .set('base', resolve('src/base'))
    },
    // devServer: {
    //     proxy: {
    //         '': {
    //             target: 'http://localhost:3000',
    //             changeOrigin: true,
    //             ws: true

    //         }
    //     }
    // }
}