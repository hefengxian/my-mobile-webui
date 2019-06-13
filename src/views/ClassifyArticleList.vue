<template>
    <div class="classify-list">
        <van-nav-bar
            style="height: 50px; line-height: 50px;"
            left-arrow
            :fixed="true"
        >
            <div
                class="nav-actions left"
                slot="left">
                <div class="nav-action">
                    <van-icon
                        name="wap-nav"
                        size="17"
                        slot="left"/>
                </div>
            </div>

            <div
                class="nav-actions right"
                slot="right">
                <div class="nav-action">
                    <van-icon
                        size="17"
                        name="success"/>
                </div>
                <div class="nav-action">
                    <van-icon
                        size="17"
                        name="filter-o"/>
                </div>
            </div>
        </van-nav-bar>

        <div class="main-container">
            <div class="total-count">共有 {{formatNumber(total)}} 篇文章</div>
            <skeleton v-show="loading" />
            <div v-show="!loading">
                <article-item
                    v-for="article in articles"
                    :article="article"
                    :key="article['Article_Detail_ID']"/>
            </div>

            <van-pagination
                v-show="total > 0"
                v-model="query.Page_No"
                :items-per-page="query.Page_Size"
                :total-items="total"
                @change="doQuery"
                mode="simple"
            />
        </div>
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
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Cell)
        .use(CellGroup)
        .use(Tag)
        .use(Checkbox)
        .use(Pagination)

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
                loading: true,
                isHLLoaded: false,
                highlighter: null,
                query: {
                    Media_Type_Code$In: '',
                    Subject_ID$In: '',
                    Extracted_Time$InDate: 'today',
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
