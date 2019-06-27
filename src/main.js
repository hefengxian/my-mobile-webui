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

    let ls = LocalStore.store
    let api = Api.api
    const token = ls.getItem(LocalStore.keys.OAUTH_KEY)
    if (to.matched.some(record => record.meta.requiresAuth)) {
        let isLogin = isTokenValid(token)
        if (!isLogin) {
            // 尝试刷新 Token
            let params = {
                grant_type: 'refresh_token',
                refresh_token: token.refresh_token,
                client_id: '',
                client_secret: '',
                scope: '',
            }
            api.login(params).then(resp => {
                // 刷新 Token 成功
                let newToken = resp.data
                // 将新 Token 存起来，并将 Axios 的请求头更新
                ls.setItem(ls.keys.OAUTH_KEY, newToken)
                api.setAuthorization(newToken)
                next()
            }).catch(err => {
                // 刷新失败，可能连 Refresh Token 都失效了，清理现有认证数据，跳转到登录页
                ls.logout()
                // this.$router.push({name: 'Login'})
                next({
                    path: '/login',
                    query: {redirect: to.fullPath}
                })
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
