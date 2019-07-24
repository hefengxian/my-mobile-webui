<template>
    <div>
        <van-nav-bar
            class=""
            title="分析"
            fixed>
        </van-nav-bar>

        <div class="main-container">
            <van-panel
                title="标题"
                desc="描述信息"
                status="状态">
                <div>
                    <canvas id="myChart" style="width: 100%"></canvas>
                </div>
            </van-panel>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    // import F2 from '@antv/f2'
    import F2 from '@antv/f2/lib/core'
    import '@antv/f2/lib/geom/interval'
    import {
        NavBar,
        Tabbar,
        TabbarItem,
        Icon,
        Skeleton,
        Cell,
        CellGroup,
        DropdownMenu,
        DropdownItem,
        Panel,
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Skeleton)
        .use(Cell)
        .use(CellGroup)
        .use(DropdownMenu)
        .use(DropdownItem)
        .use(Panel)

    export default {
        name: "Analysis",

        mixins: [],

        components: {},

        props: {},

        data() {
            return {
                activeMenu: 'summary',
                menus: [
                    {
                        text: '总体概况',
                        value: 'summary',
                    },
                    {
                        text: '内容分析',
                        value: 'content',
                    },
                    {
                        text: '选择分析',
                        value: 'selected',
                    },
                ],
            }
        },

        computed: {},

        watch: {},

        created() {
        },

        mounted() {
            // F2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
            const data = [
                {genre: 'Sports', sold: 275},
                {genre: 'Strategy', sold: 115},
                {genre: 'Action', sold: 120},
                {genre: 'Shooter', sold: 350},
                {genre: 'Other', sold: 150},
            ];

            // Step 1: 创建 Chart 对象
            const chart = new F2.Chart({
                id: 'myChart',
                pixelRatio: window.devicePixelRatio // 指定分辨率
            });

            // Step 2: 载入数据源
            chart.source(data);

            // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
            chart.interval().position('genre*sold').color('genre');

            // Step 4: 渲染图表
            chart.render();
        },

        destroyed() {
        },

        methods: {}
    }
</script>

<style lang="less">

</style>