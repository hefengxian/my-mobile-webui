<template>
    <div class="classify-list">
        <van-nav-bar
            style="height: 50px; line-height: 50px;"
            left-arrow
            :fixed="true">
            <div
                class="nav-actions left"
                slot="left">
                <div class="nav-action">
                    <van-icon
                        @click="isDrawShow = true"
                        name="wap-nav"
                        size="17"
                        slot="left"/>
                </div>
            </div>

            <div slot="title"
                 style="height: 50px; display: flex; position: relative; flex-direction: column; justify-content: center; align-items: center;">
                <van-tabs
                    type="card"
                    color="#1989fa"
                    style="width: 170px;">
                    <van-tab title="最新信息"></van-tab>
                    <van-tab title="已选信息"></van-tab>
                </van-tabs>
            </div>


            <div
                class="nav-actions right"
                slot="right">
                <div class="nav-action">
                    <van-icon
                        size="17"
                        name="eye"/>
                </div>
                <div
                    @click="isFilterShow = true"
                    class="nav-action">
                    <van-icon
                        size="17"
                        name="filter-o"/>
                </div>
            </div>
        </van-nav-bar>

        <!-- 主内容 -->
        <div class="main-container" id="container">

            <!-- 文章总数 -->
            <div class="total-count">共有 {{formatNumber(total)}} 篇文章</div>

            <!-- Skeleton 骨架屏 -->
            <skeleton v-show="loading"/>

            <!-- 文章列表 -->
            <div v-show="!loading">
                <article-item
                    v-for="article in articles"
                    :article="article"
                    :key="article['Article_Detail_ID']"/>
            </div>

            <!-- 分页 -->
            <van-pagination
                v-show="total > 0"
                v-model="query.Page_No"
                :items-per-page="query.Page_Size"
                :total-items="total"
                @change="doQuery"
                mode="simple"
            />
        </div>

        <van-popup
            v-model="isFilterShow"
            style="height: 80%; width: 100%; background-color: #fff;"
            position="top">
            <div>

            </div>
        </van-popup>
        <van-popup
            v-model="isDrawShow"
            style="height: 100%; width: 75%; background-color: #fff;"
            position="left">
            <div>
                <van-cell-group>
                    <van-cell title="单元格" value="内容" />
                    <van-cell title="单元格" value="内容" label="描述信息" />
                </van-cell-group>
                <div class="block-title">分类</div>
                <van-collapse
                    v-model="subjectActiveName"
                    accordion>
                    <van-collapse-item
                        v-for="j in 5"
                        :title="`分组 - ${j}`"
                        icon="pending-payment"
                        :name="`${j}`">
                        <van-cell
                            v-for="i in 5"
                            clickable
                            icon="debit-pay"
                            :title="`主题 - ${i}`" />
                    </van-collapse-item>
                </van-collapse>
                <div class="block-title">媒体类型</div>
                <van-collapse v-model="mediaActiveName" accordion>
                    <van-collapse-item
                        v-for="j in 5"
                        icon="send-gift-o"
                        :title="`标题-${j}`"
                        :name="`${j}`">
                        <van-cell
                            v-for="i in 5"
                            icon="chat"
                            clickable
                            :title="`单元格-${i}`" />
                    </van-collapse-item>
                </van-collapse>

            </div>
        </van-popup>
    </div>
</template>

<script>
    import Vue from 'vue'
    import HLFactory from '../util/highlight/highlighter-factory'
    import ArticleItem from '../components/ArticleItem'
    import Skeleton from '../components/Skeleton'
    import {formatNumber} from "../util/assist"
    import {
        NavBar,
        Cell,
        CellGroup,
        Icon,
        Tag,
        Checkbox,
        Pagination,
        Toast,
        Popup,
        Tab,
        Tabs,
        Collapse,
        CollapseItem ,
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Cell)
        .use(CellGroup)
        .use(Tag)
        .use(Checkbox)
        .use(Pagination)
        .use(Popup)
        .use(Tab)
        .use(Tabs)
        .use(Collapse)
        .use(CollapseItem)

    export default {
        name: "ClassifyArticleList",
        mixins: [],
        components: {
            ArticleItem,
            Skeleton,
        },
        props: {},

        data() {
            return {
                subjectActiveName: '',
                mediaActiveName: '',

                loading: true,
                isHLLoaded: false,
                isFilterShow: false,
                isDrawShow: false,
                highlighter: null,

                query: {
                    Media_Type_Code$In: '',
                    Subject_ID$In: '',
                    Extracted_Time$InDate: '2019/06/13 12:00:00 - 2019/06/13 12:30:00',
                    Article_PubTime$InDate: '',
                    Emotion_Type$$: '',
                    User_Process_Status$$: '',
                    Similar: 0,
                    Order_By: 'Total_Score$DESC',
                    Keyword: '',
                    Page_No: 1,
                    Page_Size: 20,
                },
                articles: [],
                total: 0,
            }
        },

        computed: {},
        watch: {},

        created() {
            this.doQuery(true)
            // 获取高亮词，初始化高亮组件
            this.initHighlighter()
        },

        mounted() {
        },
        destroyed() {
        },
        methods: {
            formatNumber,
            initHighlighter() {
                this.$api.article.highlightWords({type: 'focus'}).then(resp => {
                    this.highlighter = HLFactory.getInstance(resp.data)
                    this.articles = this.articles.map(this.hlCallback)
                    this.isHLLoaded = true
                })
            },
            hlCallback(v) {
                v.Article_Title = this.highlighter.highlight(v._Article_Title)
                v.Article_Abstract = this.highlighter.highlight(v._Article_Abstract)
                return v
            },

            doQuery(reset = false) {
                // 请求数据
                let params = this.query
                // 文章列表
                this.loading = true
                Toast.loading({
                    duration: 0,
                    message: '加载中...'
                })
                window.scrollTo({
                    top: 0,
                    left: 0,
                })
                this.$api.article.articleList(params).then(resp => {
                    this.articles = resp.data.list.map(v => {
                        v._Article_Title = v.Article_Title
                        v._Article_Abstract = v.Article_Abstract
                        v._check = false
                        return v
                    })
                    this.$nextTick(() => {
                        // 保证先渲染没有高亮的（如果词特别多可能会很慢，之后再渲染高亮）
                        if (this.isHLLoaded) {
                            this.articles = this.articles.map(this.hlCallback)
                        }
                    })
                    this.loading = false
                    Toast.clear()

                    // 文章总量
                    this.$api.article.articleListCount(params).then(resp => {
                        // console.log(resp)
                        this.total = resp.data.total
                    })
                })
            },


        }
    }
</script>

<style lang="less">
    .total-count {
        padding: 8px 0;
        display: block;
        color: #AAA;
        font-size: 12px;
        text-align: center;
        // margin: 8px 0;
    }
    .block-title {
        margin: 0;
        font-weight: 400;
        font-size: 14px;
        color: rgba(69,90,100,.6);
        padding: 25px 15px 15px;
    }

    .nav-actions {
        display: flex;
        height: 50px;

        &.right .nav-action:last-child {
            margin-right: -12px;
        }

        &.left .nav-action:last-child {
            margin-left: -12px;
        }

        & .nav-action {
            display: flex;
            align-items: center;
            padding: 0 12px;

            &:active {
                background-color: #e6e6e6;
            }
        }
    }


</style>
