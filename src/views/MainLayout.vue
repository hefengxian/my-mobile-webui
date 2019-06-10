<template>
    <div class="home">
        <router-view />

        <van-tabbar
            route
        >
            <van-tabbar-item
                replace
                to="/list"
                icon="bars">分类信息</van-tabbar-item>
            <van-tabbar-item
                replace
                to="/search"
                icon="search">搜索</van-tabbar-item>
            <van-tabbar-item
                replace
                to="/analysis"
                icon="chart-trending-o">分析</van-tabbar-item>
            <van-tabbar-item
                replace
                to="/personal"
                icon="manager-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {NavBar, Tabbar, TabbarItem, Icon, Skeleton} from 'vant'

    Vue.use(NavBar)
        .use(Tabbar)
        .use(TabbarItem)
        .use(Icon)
        .use(Skeleton)

    export default {
        name: 'home',
        components: {},
        data() {
            return {
                active: ''
            }
        },
        created() {
            console.log('home created')
        },
        mounted() {
            console.log('home mounted')
        },
        methods: {}
    }
</script>

<style lang="less">
    .home {
        // background-color: #aaa;
    }
</style>