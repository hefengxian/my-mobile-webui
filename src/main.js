import Vue from 'vue'
import App from './App'
import router from './router/router'
import {store} from './store/store'
import './registerServiceWorker'
import LocalStore from './plugin/local-store/'
import Api from './api/'
import {isTokenValid} from './util'

Vue.config.productionTip = false

Vue.use(LocalStore)
Vue.use(Api)



// 全局路由过滤（先于 App.vue）
router.beforeEach((to, from, next) => {
  // app
  // console.log('router.beforeEach', LocalStore.store.getItem(LocalStore.keys.OAUTH_KEY))
  const token = LocalStore.store.getItem(LocalStore.keys.OAUTH_KEY)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let isLogin = isTokenValid(token)
    if (!isLogin) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
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