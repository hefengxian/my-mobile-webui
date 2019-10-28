import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: [
        {
            path: '/',
            redirect: '/list',
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/list',
            name: 'ClassifyArticleList',
            component: () => import(/* webpackChunkName: "list" */ '../views/ClassifyArticleList'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/search',
            name: 'Search',
            component: () => import(/* webpackChunkName: "search" */ '../views/Search'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/analysis',
            name: 'Analysis',
            component: () => import(/* webpackChunkName: "analysis" */ '../views/Analysis'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/personal',
            name: 'Personal',
            component: () => import(/* webpackChunkName: "personal" */ '../views/Personal'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/detail/:id',
            name: 'ArticleDetail',
            component: () => import(/* webpackChunkName: "detail" */ '../views/ArticleDetail'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/search-list',
            name: 'SearchList',
            component: () => import(/* webpackChunkName: "search-list" */ '../views/SearchList'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/alert',
            name: 'Alert',
            component: () => import(/* webpackChunkName: "alert" */ '../views/Alert'),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: '/about',
            name: 'About',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ '../views/About'),
            meta: {
                requiresAuth: false,
           },
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "login" */ '../views/Login'),
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: '*',
            component: () => import(/* webpackChunkName: "page404" */ '../views/404'),
            meta: {
                requiresAuth: false,
            },
        }
    ]
})


export default router
