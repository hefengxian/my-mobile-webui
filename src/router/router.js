import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            meta: {
                requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: "home" */ '../views/MainLayout.vue'),
            children: [
                {
                    path: '/',
                    redirect: '/list',
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: 'list',
                    name: 'ClassifyArticleList',
                    component: () => import(/* webpackChunkName: "list" */ '../views/ClassifyArticleList.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: 'search',
                    name: 'Search',
                    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: 'analysis',
                    name: 'Analysis',
                    component: () => import(/* webpackChunkName: "analysis" */ '../views/Analysis.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: 'personal',
                    name: 'Personal',
                    component: () => import(/* webpackChunkName: "personal" */ '../views/Personal.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
            ],
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: '*',
            component: () => import(/* webpackChunkName: "page404" */ '../views/404.vue'),
            meta: {
                requiresAuth: false,
            },
        }
    ]
})


export default router
