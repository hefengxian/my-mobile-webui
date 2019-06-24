/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered (registration) {
      console.log('Service worker has been registered.')

      // 每次打开检查一次更新
      // console.log('registration.update()')
      registration.update()
      // console.log('registration.update()')
      /*setInterval(() => {
        registration.update()
        console.log('registration.update()')
      }, 1000 * 60 * 60)    // 1 小时检查一次更新*/
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated (registration) {
      // 分发 swUpdated 事件，方便在 Vue 中监听此事件；做出相应的提示
      document.dispatchEvent(
          new CustomEvent('swUpdated', {detail: registration})
      )
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
