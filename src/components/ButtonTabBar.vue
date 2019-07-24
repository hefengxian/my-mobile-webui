<template>
    <van-tabbar route>
        <van-tabbar-item
                v-for="menu in menus"
                :key="menu.route"
                :to="menu.route"
                replace
                :icon="menu.icon">{{menu.label}}</van-tabbar-item>
    </van-tabbar>
</template>

<script>
    import Vue from 'vue'
    import {Tabbar, TabbarItem} from 'vant'
    Vue.use(Tabbar)
        .use(TabbarItem)

    export default {
        name: "ButtonTabBar",

        data() {
            return {
                menus: [
                    {
                        route: '/list',
                        icon: 'bars',
                        label: '信息',
                    },
                    {
                        route: '/search',
                        icon: 'search',
                        label: '搜索',
                    },
                    {
                        route: '/analysis',
                        icon: 'chart-trending-o',
                        label: '分析',
                    },
                    {
                        route: '/personal',
                        icon: 'manager-o',
                        label: '我的',
                    },
                ]
            }
        }
    }
</script>

<style>

</style>