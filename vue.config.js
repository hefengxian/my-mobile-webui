const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

module.exports = {
    publicPath: './',
    /*devServer: {
        host: '0.0.0.0',
        hot: true,
        disableHostCheck: true,
    }*/
    pwa: {
        // 默认值：package.json 的 "name" 字段
        // 在生成的 HTML 中用作 apple-mobile-web-app-title meta 标签的值。注意你需要编辑 public/manifest.json 来配合它。
        name: '舆情云',
        themeColor: '#F3F3F3',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'default',
        assetsVersion: '001',
        iconPaths: {
            favicon32: 'img/icons/icon-72x72.png',
            favicon16: 'img/icons/icon-72x72.png',
            appleTouchIcon: 'img/icons/icon-152x152.png',
            maskIcon: '',
            msTileImage: 'img/icons/icon-144x144.png'
        },

        // 配置 workbox 插件
        workboxPluginMode: 'GenerateSW',
        /*workboxOptions: {
            // InjectManifest 模式下 swSrc 是必填的。
            swSrc: 'dev/sw.js',
            // ...其它 Workbox 选项...
        }*/

    },

    configureWebpack: {
        plugins: [
            new MomentLocalesPlugin({
                localesToKeep: [/*'es-us', */'zh-cn'],
            }),
        ]
    }
}
