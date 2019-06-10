<template>
    <div class="home">
        <van-nav-bar
            style="height: 50px; line-height: 50px;"
            title="标题"
            left-arrow
            :fixed="true"
        >
            <van-icon
                name="wap-nav"
                size="17"
                slot="left"/>
            <van-icon
                size="17"
                name="filter-o"
                slot="right"/>

        </van-nav-bar>

        <div
            style="margin: 50px 0; padding: 8px 0"
        >
            <div
                v-for="i in 10"
                :key="i"
                style="margin: 8px 0; background-color: #fff; padding: 8px"
            >
                <van-skeleton title :row="2"/>
            </div>
        </div>

        <van-tabbar
            v-model="active"
            active-color="#07c160"
            inactive-color="#000"
        >
            <van-tabbar-item icon="bars">分类信息</van-tabbar-item>
            <van-tabbar-item icon="search">搜索</van-tabbar-item>
            <van-tabbar-item icon="chart-trending-o">分析</van-tabbar-item>
            <van-tabbar-item icon="manager-o">我的</van-tabbar-item>
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