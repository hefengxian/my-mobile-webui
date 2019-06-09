import Vue from 'vue'
import App from './App'
import router from './router/router'
import {store} from './store/store'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // app
  console.log('router.beforeEach')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // store.state.global.loading = true
    /*setTimeout(() => {
      // store.state.global.loading = false
      let random = Math.round(Math.random())

    }, 500)*/
    let isLogin = true

    // console.log(isLogin, random)
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