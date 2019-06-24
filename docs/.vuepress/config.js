/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: 𝑭𝒓𝒂𝒏𝒌 2019-06-21 15-10
 * @version 1.0
 */
module.exports = {
    base: '/kwmm/docs/',
    title: '舆情云',
    description: '在手机上看舆情',
    dest: 'dist/docs/',

    themeConfig: {
        nav: [
            { text: 'Android', link: '/android/' },
            { text: 'IOS', link: '/ios/' },
        ]
    },

    configureWebpack: {
        resolve: {
            alias: {
                '@pub': '/kwmm/docs/'
            }
        }
    }
}
