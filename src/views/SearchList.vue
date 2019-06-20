<template>
    <div class="ksm-search-list">
        <van-nav-bar
            class="ksm-nav detail-nav"
            :title="title"
            fixed
            @click-left="$router.back()"
        >
            <!-- 返回按钮 -->
            <div
                class="nav-actions left"
                slot="left">
                <van-button
                    square
                    class="nav-action"
                    size="small"
                    icon="arrow-left"/>
            </div>
        </van-nav-bar>

        <div style="margin-top: 50px;">
            <!-- 文章总数 -->
            <div class="total-count">共有 {{formatNumber(total)}} 篇文章</div>

            <!-- Skeleton 骨架屏 -->
            <skeleton v-show="loading"/>

            <!-- 文章列表 -->
            <div v-show="!loading">
                <article-item
                    v-for="(article, index) in articles"
                    :article="article"
                    :tag-groups="tgs"
                    :can-read="false"
                    :show-action="false"
                    :key="article.Article_Detail_ID"
                    @delete="onDelete(index)"
                />
            </div>

            <!-- 分页 -->
            <van-pagination
                v-show="total > 0"
                v-model="query.Page_No"
                :items-per-page="query.Page_Size"
                :total-items="total"
                @change="() => doQuery()"
                mode="simple"
            />
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import CommonMixin from '../util/CommonMixin'
    import ArticleItem from '../components/ArticleItem'
    import Skeleton from '../components/Skeleton'
    import {formatNumber} from "../util/assist"
    import {
        NavBar,
        Pagination,
        Toast,
    } from 'vant'

    Vue.use(NavBar)
        .use(Pagination)

    export default {
        name: "SearchList",
        mixins: [CommonMixin],
        components: {
            ArticleItem,
            Skeleton,
        },
        props: {},
        data() {
            return {
                query: {
                    Extracted_Time$InDateTime: 'pastdays_7',
                    // Article_PubTime$InDateTime: 'today',
                    Keyword: '',
                    Domain_Code: '',
                    Order_By: '',
                    Page_No: 1,
                    Page_Size: 20,
                },
                title: '',
                loading: false,
                articles: [],
                total: 0,
            }
        },
        computed: {},
        watch: {},
        created() {
            this.initTgs()
        },
        mounted() {
        },
        destroyed() {
        },
        methods: {
            formatNumber,
            doQuery(reset = false) {
                if (reset) {
                    // 重置页码
                    this.query.Page_No = 1
                }
                let params = this.query
                params.keyword = this.$route.query.keyword

                // 加载提示
                this.loading = true
                Toast.loading({message: '加载中...'})

                // 滚动到页头
                window.scrollTo({top: 0, left: 0})

                this.$api.article.search(params).then(resp => {
                    this.total = resp.data.total
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
                })
            },
            hlCallback(v) {
                v.Article_Title = this.highlighter.highlight(v._Article_Title)
                v.Article_Abstract = this.highlighter.highlight(v._Article_Abstract)
                return v
            },
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if (from.name !== 'ArticleDetail') {
                    vm.title = `「${to.query.keyword}」搜索结果`
                    vm.initHighlighter(['focus'], to.query.keyword).then(highlighter => {})
                    vm.doQuery(true)
                    vm.total = 0
                }
            })
        },
    }
</script>

<style lang="less">

</style>
