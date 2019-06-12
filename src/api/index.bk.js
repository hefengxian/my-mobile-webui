/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2018-08-09 19-05
 * @version 1.0
 */

import apiClient from './api-client'
import dashboard  from './dashboard-api'
import publicApi from './public-api'
import system from './system-api'
import personal from './personal-api'
import search from './search-api'
import classifyList from './classifylist'

const api = {
    ...apiClient,
    dashboard,
    public: publicApi,
    system,
    personal,
    search,
    classifyList,
}

export default {
    // ...api,
    // 可以作为 Vue 插件
    install(Vue, options) {
        Vue.api = api
        Vue.prototype.$api = api
    },
    api
}
