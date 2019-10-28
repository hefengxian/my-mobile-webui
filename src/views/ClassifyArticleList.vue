<template>
    <div class="main-container classify-list">
        <van-nav-bar
            class="ksm-nav"
            :fixed="true">
            <div
                class="nav-actions left"
                slot="left">
                <van-button
                    square
                    class="nav-action"
                    size="small"
                    icon="wap-nav"
                    @click="isDrawShow = true"/>
            </div>

            <div slot="title"
                 class="title-action">
                <van-tabs
                    :active="activeTagMenu"
                    type="card"
                    :color="activeColor"
                    style="width: 170px;"
                    @click="handleTabClick">
                    <van-tab
                        :name="''"
                        title="最新信息"/>
                    <van-tab
                        name="S"
                        title="已选信息"/>
                </van-tabs>
            </div>

            <div
                class="nav-actions right"
                slot="right">
                <van-button
                    square
                    class="nav-action"
                    size="small"
                    icon="eye-o"
                    @click="readAll"/>
                <van-button
                    square
                    class="nav-action"
                    size="small"
                    icon="filter-o"
                    @click="isFilterShow = true"/>
            </div>
        </van-nav-bar>

        <!-- 主内容 -->
        <div class="">

            <!-- 文章总数 -->
            <div class="total-count">共有 {{formatNumber(total)}} 篇文章</div>

            <!-- Skeleton 骨架屏 -->
            <skeleton v-show="loading"/>

            <!-- 文章列表 -->
            <div v-show="!loading">
                <article-item
                    v-for="(article, index) in articles"
                    :article="article"
                    :tag-groups="tagGroups"
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

        <!-- 过滤条件 -->
        <query-filter
            v-model="isFilterShow"
            :tag-groups="tagGroups"
            :query="query"
            @change="handleQueryChange"
        />

        <!-- 抽屉筛选侧面菜单 -->
        <draw-filter
            v-model="isDrawShow"
            :query="query"
            :media-type-groups="mediaTypeGroups"
            :subject-categories="subjectCategories"
            @change="handleQueryChange"
        />
        <!-- 底部栏 -->
        <ButtonTabBar/>
    </div>
</template>

<script>
    import Vue from 'vue'
    import HLFactory from '../util/highlight/highlighter-factory'
    import ArticleItem from '../components/ArticleItem'
    import Skeleton from '../components/Skeleton'
    import QueryFilter from '../components/QueryFilter/QueryFilter'
    import DrawFilter from '../components/DrawFilter'
    import {formatNumber} from "../util/assist"
    import CommonMixin from '../util/CommonMixin'
    import {
        NavBar,
        Cell,
        CellGroup,
        Icon,
        Tag,
        // Checkbox,
        Pagination,
        Toast,
        Popup,
        Tab,
        Tabs,
        Collapse,
        CollapseItem,
        Row,
        Col,
        Search,
        Button,
        Dialog,
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Cell)
        .use(CellGroup)
        .use(Tag)
        // .use(Checkbox)
        .use(Pagination)
        .use(Popup)
        .use(Tab)
        .use(Tabs)
        .use(Collapse)
        .use(CollapseItem)
        .use(Row)
        .use(Col)
        .use(Search)
        .use(Button)
        .use(Dialog)

    export default {
        name: "ClassifyArticleList",
        mixins: [CommonMixin],
        components: {
            ArticleItem,
            Skeleton,
            QueryFilter,
            DrawFilter,
        },
        props: {},

        data() {
            // 用户信息
            let ls = this.$localStore
            let u = ls.getItem(ls.keys.USER_KEY)
            let Page_Size = ls.getItem(ls.keys.PAGE_SIZE)
            Page_Size = Page_Size ? Page_Size : 50
            return {
                u,
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
                    Extracted_Time$InDate: 'today',
                    Article_PubTime$InDate: '',
                    User_Last_Process_Time$InDate: '',
                    Emotion_Type$$: '',
                    User_Process_Status$$: '',
                    Followup_Status$$: '',
                    Similar: 0,
                    Tag_ID: '',
                    Order_By: 'Total_Score$DESC',
                    Keyword: '',
                    Page_No: 1,
                    Page_Size,
                },
                articles: [],
                total: 0,
                mediaTypeGroups: [],
                subjectCategories: {
                    relatedToMe: {
                        label: '分类 · 与我相关',
                        data: [],
                        all: '',
                    },
                    other: {
                        label: '分类 · 外部信息',
                        data: [],
                        all: '',
                    },
                },
                tagGroups: [],

                cache: {
                    normal: {
                        Extracted_Time$InDate: 'today',
                        Article_PubTime$InDate: '',
                        Emotion_Type$$: '',
                        User_Process_Status$$: '',
                        Order_By: '',
                    },
                    selected: {
                        Extracted_Time$InDate: '',
                        User_Last_Process_Time$InDate: 'today',
                        Article_PubTime$InDate: '',
                        Followup_Status$$: '',
                        Tag_ID: '',
                        Emotion_Type$$: '',
                        Order_By: 'User_Last_Process_Time$DESC',
                    },
                }
            }
        },

        computed: {
            activeTagMenu() {
                return this.query.User_Process_Status$$ === 'S' ? 'S' : ''
            },
            isSelectedQuery() {
                return this.query.User_Process_Status$$ === 'S'
            }
        },
        watch: {},

        created() {
            this.doQuery(true)
            // 获取高亮词，初始化高亮组件
            this.initHighlighter()

            // 获取所有的媒体类型
            this.$api.common.selectHelper('media_type,tag_list').then(resp => {
                let medias = resp.data.result['media_type']
                let tagGroups = resp.data.result['tag_list']
                this.tagGroups = Object.values(tagGroups)

                let mediaTypeGroups = [
                    {label: '新闻', value: 'N', children: []},
                    {label: '自媒体', value: 'P', children: []},
                    {label: '论坛', value: 'F', children: []},
                    {label: '多媒体', value: 'M', children: []},
                    {label: '其它', value: 'O', children: []},
                ]
                // console.log(medias)
                this.mediaTypeGroups = mediaTypeGroups.map(group => {
                    let groupMedias = medias.filter(m => group.value === m.Media_Type_Group_Code)
                    let all = {
                        Media_Type_Code: groupMedias.map(m => m.Media_Type_Code).join(','),
                        Media_Type_Group_Code: group.value,
                        Media_Type_Name: "所有",
                        icon: 'award-o',
                    }
                    group.children = [all, ...groupMedias]
                    return group
                })
            })

            this.initSubjectCategories()
        },

        mounted() {
        },
        activated() {
            let ls = this.$localStore
            let u = ls.getItem(ls.keys.USER_KEY)
            let pageSize = ls.getItem(ls.keys.PAGE_SIZE)
            pageSize = pageSize ? pageSize : 50
            if (u.User_ID !== this.u.User_ID || pageSize !== this.query.Page_Size) {
                this.u = u
                // console.log('need refresh')
                this.initSubjectCategories()
                this.resetQueryParams({Page_Size: pageSize})
                this.doQuery(true)
            }
        },
        destroyed() {
        },
        methods: {
            formatNumber,

            readAll() {
                let needMark = this.articles.filter(v => {
                    return ['U', 'S', 'R'].indexOf(v['User_Process_Status']) < 0
                })

                if (needMark.length < 1) {
                    Toast('没有文章是未读状态！')
                    return
                }

                Dialog.confirm({
                    title: '标记已读',
                    message: `确定要将 ${needMark.length} 篇未读文章标记为已读？`,
                }).then(() => {
                    let ids = needMark.map(v => v.Article_Detail_ID)
                    this.$api.article.readArticle({Ids: ids.join(',')}).then(resp => {
                        // console.log(resp.data)
                    })
                    this.articles = this.articles.map(v => {
                        if (ids.indexOf(v.Article_Detail_ID) > -1) {
                            v.User_Process_Status = 'U'
                        }
                        return v
                    })
                }).catch(cancel => {
                    // Do nothing
                })
            },

            /**
             * 切换已选和普通列表
             */
            handleTabClick(name, title) {
                // 备份一下条件
                if (name === 'S') {
                    // 切换到已选列表，备份普通条件
                    Object.keys(this.cache.normal).forEach(v => this.cache.normal[v] = this.query[v])
                    // 将备份的已选条件赋值给 query
                    this.query = {...this.query, ...this.cache.selected}
                    // 再将只属于普通列表的条件重置
                    this.query.User_Process_Status$$ = 'S'
                } else {
                    // 切换到普通列表，备份已选条件
                    Object.keys(this.cache.selected).forEach(v => this.cache.selected[v] = this.query[v])
                    // 将备份的普通条件赋值给 query
                    this.query = {...this.query, ...this.cache.normal}
                    // 再将只属于已选列表的条件重置
                    let selectOnly = [
                        'Emotion_Type$$',
                        'Tag_ID',
                        'Followup_Status$$',
                        'User_Last_Process_Time$InDate'
                    ]
                    selectOnly.forEach(v => this.query[v] = '')
                    if (this.query.Order_By === 'User_Last_Process_Time$DESC') {
                        this.query.Order_By = 'Total_Score$DESC'
                    }
                    this.query.User_Process_Status$$ = ''
                }
                this.doQuery(true)
            },

            /**
             * 执行查询
             *
             * @param {string} key 哪一个条件，对应 query 对象的键
             * @param {string} value 值
             */
            handleQueryParamChange(key, value = '') {
                this.isDrawShow = false
                this.query[key] = value
                this.doQuery(true)
            },
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


            /**
             * 执行查询
             *
             * @param {boolean} reset 是否重置页码
             */
            doQuery(reset = false) {
                if (reset) {
                    // 重置页码
                    this.query.Page_No = 1
                }
                let params = {...this.query}
                if (params.User_Process_Status$$ === 'S' && params.Extracted_Time$InDate === '') {
                    delete params.Extracted_Time$InDate
                }

                // 加载提示
                this.loading = true
                Toast.loading({duration: 0, message: '加载中...'})

                // 滚动到页头
                window.scrollTo({top: 0, left: 0})

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
                })
                // 文章总量
                this.$api.article.articleListCount(params).then(resp => {
                    this.total = resp.data.total
                })
            },

            /**
             * 重置所有查询条件
             * @param params
             */
            resetQueryParams(params) {
                let defaultParams = {
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
                    Page_Size: 50,
                }
                this.query = {...defaultParams, ...params}
            },

            /**
             * 监听文章 Item 中发起的 delete 事件
             * @param index
             */
            onDelete(index) {
                this.articles.splice(index, 1)
            },

            /**
             * 初始化主题、主题目录
             */
            initSubjectCategories() {
                this.$api.article.subjectTree().then(resp => {
                    let {data} = resp
                    let relatedToMe = []
                    let other = []
                    let allRelatedToMe = []
                    let allOther = []

                    data.result.forEach(c => {
                        let tmpCategory = {
                            Subject_Category_Name: c.Subject_Category_Name,
                            Subject_Category_ID: c.Subject_Category_ID,
                            subjects: []
                        }
                        let categorySids = []
                        c.subjects.forEach(s => {
                            categorySids.push(s.Subject_ID)
                            if (c.Focus_Type === 'M') {
                                allRelatedToMe.push(s.Subject_ID)
                            } else {
                                allOther.push(s.Subject_ID)
                            }
                            tmpCategory.subjects.push(s)
                        })
                        if (categorySids.length > 1) {
                            tmpCategory.subjects.splice(0, 0, {
                                Subject_Name: '所有',
                                Subject_ID: categorySids.join(','),
                                icon: 'award-o',
                            })
                        }

                        if (c.Focus_Type === 'M') {
                            relatedToMe.push(tmpCategory)
                        } else {
                            other.push(tmpCategory)
                        }
                    })
                    this.subjectCategories.relatedToMe.data = relatedToMe
                    this.subjectCategories.relatedToMe.all = allRelatedToMe.join(',')
                    this.subjectCategories.other.data = other
                    this.subjectCategories.other.all = allOther.join(',')
                })
            },

            handleQueryChange(query) {
                this.query = query
                this.doQuery(true)
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                // 处理文章详情页的变动
                if (to.params.article) {
                    // console.log('list 文章已经变动')
                    vm.articles = vm.articles.map(a => {
                        if (a.Article_Detail_ID === to.params.article.Article_Detail_ID) {
                            return to.params.article
                        }
                        return a
                    })
                }
                // 处理在详情页删除了文章
                if (to.params.delete) {
                    // console.log('list 文章已经删除')
                    vm.articles = vm.articles.filter(a => {
                        return a.Article_Detail_ID !== to.params.delete
                    })
                }

            })
        },
    }
</script>

<style lang="less">
    .list-item-all:after {
        left: 0 !important;
    }

    .list-menu {
        & .van-collapse-item__content {
            padding: 0 0 0 15px !important;
        }
    }

    .title-action {
        height: 50px;
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        & .van-tabs--card {
            padding-top: 0;
        }
    }
</style>
