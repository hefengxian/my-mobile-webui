import Vue from 'vue'
import App from './App'
import router from './router/router'
import {store} from './store/store'
import './registerServiceWorker'        // PWA SW
import LocalStore from './plugin/local-store/'
import Api from './api/'
import {isTokenValid} from './util/assist'
import moment from 'moment'
import FastClick from 'fastclick' // 引入插件

// 处理 300ms 点击时间延时
FastClick.attach(document.body)

// 新版的 Moment.js 需要手动导入地区
moment.locale('zh-cn')
Vue.prototype.$moment = moment

Vue.config.productionTip = false
Vue.use(LocalStore)
Vue.use(Api)

// 全局路由过滤（先于 App.vue）
router.beforeEach((to, from, next) => {
    const token = LocalStore.store.getItem(LocalStore.keys.OAUTH_KEY)
    if (to.matched.some(record => record.meta.requiresAuth)) {
        let isLogin = isTokenValid(token)
        if (!isLogin) {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        } else {
            next()
        }
    } else {
        next() // 确保一定要调用 next()
    }
})


const app = new Vue({
    store,
    router,
    render: h => h(App)
})
app.$mount('#app')
