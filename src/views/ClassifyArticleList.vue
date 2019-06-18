<template>
    <div class="classify-list">
        <van-nav-bar
            style="height: 50px; line-height: 50px;"
            left-arrow
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
                        title="最新信息"/>
                    <van-tab
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
        <div class="main-container">

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

        <van-popup
            v-model="isFilterShow"
            style="height: 80%; width: 100%; background-color: #fff;"
            position="top">
            <div style="position: relative; height: 100%; overflow-y: auto;">
                <van-search
                    v-model="query.Keyword"
                    type="text"
                    placeholder="请输入搜索关键词"/>
                <div style="padding: 0 16px; margin-bottom: 50px;">
                    <template
                        v-for="filter in filters">
                        <div
                            class="block-title van-ellipsis"
                            style="padding-left: 0; padding-top: 0; display: flex">
                            <div style="flex: 1;padding-right: 8px;">{{filter.title}}</div>
                            <div
                                v-if="filter.datePicker && filter.datePicker.isSelect(query[filter.value])"
                                class="van-ellipsis">{{query[filter.value]}}
                            </div>
                        </div>
                        <van-row gutter="16">
                            <van-col
                                v-for="item in filter.data"
                                :key="item.value"
                                span="8">
                                <van-button
                                    style="margin-bottom: 16px;"
                                    square
                                    :type="item.value === query[filter.value] ? 'info' : 'default'"
                                    size="small"
                                    class="van-ellipsis"
                                    block
                                    @click="query[filter.value] = item.value"
                                >{{item.label}}
                                </van-button>
                            </van-col>
                            <van-col
                                v-if="filter.datePicker"
                                span="8">
                                <van-button
                                    style="margin-bottom: 16px;"
                                    square
                                    :type="filter.datePicker.isSelect(query[filter.value]) ? 'info' : 'default'"
                                    @click="filter.datePicker.show = !filter.datePicker.show"
                                    size="small"
                                    class="van-ellipsis"
                                    block>{{`自定义...`}}
                                </van-button>
                            </van-col>
                        </van-row>

                        <date-range-picker
                            v-if="filter.datePicker"
                            v-show="filter.datePicker.show"
                            :value="query[filter.value]"
                            style="margin-bottom: 16px"
                            @cancel="filter.datePicker.show = false"
                            @confirm="val => {query[filter.value] = val; filter.datePicker.show = false}"
                        />
                    </template>
                </div>
            </div>
            <div style="position: absolute; bottom: 0; width: 100%; display: flex; z-index: 5">
                <van-button
                    style="flex: 1"
                    square
                    block
                    type="default"
                    @click="resetFilter">重置
                </van-button>
                <van-button
                    style="flex: 1"
                    square
                    block
                    type="info"
                    @click="() => {doQuery(true); isFilterShow = false}"
                >确定
                </van-button>
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
                            :color="activeColor"
                            name="checked"
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
                                :color="activeColor"
                                name="checked"
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
                            :color="activeColor"
                            name="checked"
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
                                :color="activeColor"
                                name="checked"
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
    import DateRangePicker from '../components/DateRangePicker'
    import {formatNumber, isDateRangeValid} from "../util/assist"
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
        Row,
        Col,
        Search,
        Button,
        DatetimePicker,
        Dialog,
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
        .use(Row)
        .use(Col)
        .use(Search)
        .use(Button)
        .use(DatetimePicker)
        .use(Dialog)

    export default {
        name: "ClassifyArticleList",
        mixins: [],
        components: {
            ArticleItem,
            Skeleton,
            DateRangePicker,
        },
        props: {},

        data() {
            // 用户信息
            let u = this.$localStore.getItem(this.$localStore.keys.USER_KEY)

            return {
                u,
                activeColor: '#1989fa',
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
                    Extracted_Time$InDate: '2019/06/17 00:00:00 - 2019/06/17 00:30:00',
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
                tagGroups: [],

                filters: [
                    {
                        datePicker: {
                            show: false,
                            value: '',
                            isSelect: isDateRangeValid, // 如果时间格式满足指定的时间范围格式就代表当前选择了自定义时间
                        },
                        title: '采集时间',          // 筛选项的标题
                        value: 'Extracted_Time$InDate',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '最近 3 小时', value: 'pasthours_3'},
                            {label: '最近 18 小时', value: 'pasthours_18'},
                            {label: '今天', value: 'today'},
                            {label: '昨天', value: 'yesterday'},
                            {label: '最近 3 天', value: 'pastdays_3'},
                            {label: '最近 7 天', value: 'pastdays_7'},
                            {label: '本周', value: 'thisweek'},
                            {label: '本月', value: 'thismonth'},
                        ],           // 选项，数组
                    },
                    {
                        datePicker: {
                            show: false,
                            value: '',
                            isSelect: isDateRangeValid, // 如果时间格式满足指定的时间范围格式就代表当前选择了自定义时间
                        },
                        title: '发布时间',          // 筛选项的标题
                        value: 'Article_PubTime$InDate',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '最近 3 小时', value: 'pasthours_3'},
                            {label: '最近 18 小时', value: 'pasthours_18'},
                            {label: '今天', value: 'today'},
                            {label: '昨天', value: 'yesterday'},
                            {label: '最近 3 天', value: 'pastdays_3'},
                            {label: '最近 7 天', value: 'pastdays_7'},
                            {label: '本周', value: 'thisweek'},
                            {label: '本月', value: 'thismonth'},
                            {label: '空', value: 'NULL'},
                        ],           // 选项，数组
                    },
                    {
                        title: '情感属性',          // 筛选项的标题
                        value: 'Emotion_Type$$',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '疑似负面', value: '3'},
                            {label: '疑似正面', value: '1'},
                            {label: '确认负面', value: '6'},
                            {label: '确认正面', value: '4'},
                        ],           // 选项，数组
                    },
                    {
                        title: '文章状态',          // 筛选项的标题
                        value: 'User_Process_Status$$',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '未读', value: 'N'},
                            {label: '已读', value: 'U'},
                            {label: '已选', value: 'S'},
                        ],           // 选项，数组
                    },
                    {
                        title: '排序',          // 筛选项的标题
                        value: 'Order_By',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {
                                label: '相关度',
                                value: 'Total_Score$DESC'
                            },
                            {
                                label: '采集时间',
                                value: 'Article_Extracted_Time$DESC'
                            },
                            {
                                label: '发布时间',
                                value: 'Article_PubTime$DESC'
                            },
                        ],           // 选项，数组
                    },
                ]
            }
        },

        computed: {
            activeTagMenu() {
                return this.query.User_Process_Status$$ === 'S' ? 1 : 0
            },
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
                        console.log(resp.data)
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

            /**
             *
             */
            resetFilter() {
                this.query.Extracted_Time$InDate = 'today'
                this.query.Article_PubTime$InDate = ''
                this.query.Emotion_Type$$ = ''
                this.query.User_Process_Status$$ = ''
                this.query.Order_By = 'Total_Score$DESC'
                this.query.Keyword = ''
            },


            /**
             * 监听文章 Item 中发起的 delete 事件
             * @param index
             */
            onDelete(index) {
                this.articles.splice(index, 1)
            }
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
        font-size: 12px;
        color: rgba(69, 90, 100, .6);
        padding: 20px 15px 10px;
    }

    .list-item-all:after {
        left: 0 !important;
    }

    .list-menu {
        & .van-collapse-item__content {
            padding: 0 0 0 15px !important;
        }
    }

    .nav-actions {
        display: flex;
        height: 50px;
        align-items: center;

        &.left .nav-action:first-child {
            margin-left: -12px;
        }

        &.right .nav-action:last-child {
            margin-right: -12px;
        }

        & .nav-action {
            min-width: 40px;
            font-size: 16px;
            border: none;
        }
    }

    .title-action {
        height: 50px;
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
