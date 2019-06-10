<template>
    <div>
        <van-nav-bar
            style="height: 50px; line-height: 50px;"
            title="分类信息"
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
    </div>
</template>

<script>
    import Vue from 'vue'
    import {NavBar, Tabbar, TabbarItem, Icon, Skeleton} from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Skeleton)

    export default {
        name: "ClassifyArticleList"
    }
</script>

<style scoped>

</style>