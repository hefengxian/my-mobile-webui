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
                    @click="handleTabClick"
                    type="card"
                    color="#1989fa"
                    style="width: 170px;">
                    <van-tab
                        title="最新信息" />
                    <van-tab
                        title="已选信息" />
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
        <div class="main-container">

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
                    <van-cell
                        center
                        :title="u.User_Name"
                        :label="`${u.Client_Name} - ${u.Role_Name}`">
                        <img
                            slot="icon"
                            src="https://img.yzcdn.cn/vant/cat.jpeg"
                            style="width: 40px; height: 40px; border-radius: 20px; margin-right: 16px;"
                            alt="">
                    </van-cell>
                </van-cell-group>


                <!-- 分类 -->
                <div class="block-title">分类</div>
                <van-collapse
                    class="list-menu"
                    v-model="subjectActiveName"
                    :border="false"
                    accordion>

                    <van-cell
                        icon="award-o"
                        clickable
                        class="list-item-all"
                        :border="true"
                        @click="handleQueryParamChange('Subject_ID$In')"
                        title="所有">
                        <van-icon
                            v-if="query.Subject_ID$In === ''"
                            color="#07c160"
                            name="success"
                        />
                    </van-cell>

                    <van-collapse-item
                        v-for="category in subjectCategories"
                        icon="send-gift-o"
                        :key="category.Subject_Category_Name"
                        :title="category.Subject_Category_Name"
                        :name="category.Subject_Category_ID">
                        <van-cell
                            class="list-item-all"
                            @click="handleQueryParamChange('Subject_ID$In', subject.Subject_ID)"
                            v-for="subject in category.subjects"
                            :icon="subject.icon ? subject.icon : 'debit-pay'"
                            :key="subject.Subject_ID"
                            clickable
                            :title="subject.Subject_Name">
                            <van-icon
                                v-if="query.Subject_ID$In === subject.Subject_ID"
                                color="#07c160"
                                name="success"
                            />
                        </van-cell>
                    </van-collapse-item>
                </van-collapse>

                <!-- 媒体类型 -->
                <div class="block-title">媒体类型</div>
                <van-collapse
                    v-model="mediaActiveName"
                    class="list-menu"
                    accordion>
                    <van-cell
                        icon="award-o"
                        clickable
                        class="list-item-all"
                        :border="true"
                        @click="handleQueryParamChange('Media_Type_Code$In')"
                        title="所有">
                        <van-icon
                            v-if="query.Media_Type_Code$In === ''"
                            color="#07c160"
                            name="success"
                        />
                    </van-cell>

                    <van-collapse-item
                        v-for="group in mediaTypeGroups"
                        :title="group.label"
                        :key="group.value"
                        icon="pending-payment"
                        :name="group.value">

                        <van-cell
                            v-for="media in group.children"
                            @click="handleQueryParamChange('Media_Type_Code$In', media.Media_Type_Code)"
                            clickable
                            :key="media.Media_Type_Code"
                            :icon="media.icon ? media.icon : 'debit-pay'"
                            :border="true"
                            :title="media.Media_Type_Name">
                            <van-icon
                                v-if="query.Media_Type_Code$In === media.Media_Type_Code"
                                color="#07c160"
                                name="success"
                            />
                        </van-cell>
                    </van-collapse-item>
                </van-collapse>
                <!-- /媒体类型 -->

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
        CollapseItem,
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
            // 用户信息
            let u = this.$localStore.getItem(this.$localStore.keys.USER_KEY)

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
                    Extracted_Time$InDate: '2019/06/14 12:00:00 - 2019/06/14 12:30:00',
                    // Extracted_Time$InDate: 'today',
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
                mediaTypeGroups: [],
                subjectCategories: [],
            }
        },

        computed: {},
        watch: {},

        created() {
            this.doQuery(true)
            // 获取高亮词，初始化高亮组件
            this.initHighlighter()

            // 获取所有的媒体类型
            this.$api.common.selectHelper('media_type,tag_list').then(resp => {
                let medias = resp.data.result['media_type']
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

            this.$api.article.subjectTree().then(resp => {
                let {data} = resp
                this.subjectCategories = data.result
            })
        },

        mounted() {
        },
        destroyed() {
        },
        methods: {
            formatNumber,

            handleTabClick(index, title) {
                let value = index === 0 ? '' : 'S'
                this.handleQueryParamChange('User_Process_Status$$', value)
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
                let params = this.query

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
                    // console.log(resp)
                    this.total = resp.data.total
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
        font-size: 12px;
        color: rgba(69, 90, 100, .6);
        padding: 25px 15px 15px;
    }

    .list-item-all:after {
        left: 0 !important;
    }

    .list-menu {
        & .van-collapse-item__content {
            padding: 0 0 0 15px !important;
            /*& .van-cell {
                padding-left: 30px;
                &:after {
                    left: 30px!important;
                }
            }*/
        }
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
