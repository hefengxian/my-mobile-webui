module.exports = {
    presets: [
        '@vue/app',
        "@vue/babel-preset-jsx",
    ],
    plugins: [
        // Vant 模块化加载
        ['import', {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true
        }, 'vant']
    ]
}
