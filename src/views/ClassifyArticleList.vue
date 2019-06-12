<template>
    <div class="classify-list">
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
            <van-icon
                size="17"
                name="success"
                slot="right"/>

        </van-nav-bar>

        <div class="main-container">
            <div class="total-count">共有 {{formatNumber(total)}} 篇文章</div>

            <div v-show="loading">
                <div
                    class="skeleton-wrapper"
                    v-for="i in 10"
                    :key="i">
                    <van-skeleton title :row="2"/>
                </div>
            </div>
            <div v-show="!loading">
                <div
                    v-for="article in articles"
                    :key="article.Article_Detail_ID"
                    class="article-card">
                    <div class="card-left">
                        <van-checkbox
                            v-if="false"
                            v-model="article._check"
                            style="margin-right: 16px"/>
                        <!-- <van-tag mark type="success">标签</van-tag>-->
                    </div>
                    <div class="card-right">
                        <div class="article-content">
                            <div
                                class="article-title"
                                v-html="article.Article_Title"></div>
                            <div
                                class="article-abstract"
                                v-html="article.Article_Abstract"></div>
                            <div class="article-meta">
                                <div class="meta-item">{{getMetaInfo(article)}}</div>
                            </div>
                            <div class="article-tag">
                                <van-tag
                                    v-for="tag in article.Tags"
                                    :key="tag.Tag_ID"
                                    class="article-tag"
                                    color="#7232dd"
                                    plain>{{tag.Tag}}
                                </van-tag>
                            </div>
                        </div>

                        <div class="article-actions">
                            <ul class="left-actions">
                                <li class="article-action">
                                    <van-icon
                                        size="16"
                                        name="eye-o" />
                                    &nbsp;标记已读
                                </li>
                                <li class="article-action">
                                    <van-icon
                                        size="16"
                                        name="success" />
                                    &nbsp;选择
                                </li>
                                <li class="article-action">
                                    <van-icon
                                        size="16"
                                        name="label-o" />
                                    &nbsp;打标签
                                </li>
                                <li class="article-action">
                                    <van-icon
                                        size="16"
                                        name="ellipsis" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
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
    import moment from 'moment'
    import {formatNumber} from "../util"
    import {
        NavBar,
        Cell,
        CellGroup,
        Icon,
        Skeleton,
        Tag,
        Checkbox,
        Pagination,
        Toast,
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Skeleton)
        .use(Cell)
        .use(CellGroup)
        .use(Tag)
        .use(Checkbox)
        .use(Pagination)


    // 新版的 Moment.js 需要手动导入地区
    moment.locale('zh-cn')

    export default {
        name: "ClassifyArticleList",
        mixins: [],
        components: {},
        props: {},

        data() {
            return {
                loading: true,
                query: {
                    Media_Type_Code$In: '',
                    Subject_ID$In: '',
                    Extracted_Time$InDate: 'yesterday',
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
        },

        mounted() {
        },
        destroyed() {
        },
        methods: {
            formatNumber,
            /**
             * 处理发布时间格式化
             *
             * @param {object} article 文章
             * @return {string} 格式化之后的发布时间
             */
            getPublishTime(article) {
                let result = ' - '
                if (article['Article_PubTime'] === null) {
                    if (article['Article_PubTime_Str'] !== null && typeof article['Article_PubTime_Str'] === 'string') {
                        result = article['Article_PubTime_Str'].trim()
                    }
                } else if (typeof article['Article_PubTime'] === 'string') {
                    let pubTime = article['Article_PubTime'].trim()
                    if (moment(pubTime).isValid()) {
                        result = moment(pubTime).fromNow()
                    }
                }
                return result
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
                    // behavior: 'smooth'
                })
                this.$api.article.articleList(params).then(resp => {
                    this.articles = resp.data.list.map(v => {
                        v._check = false
                        return v
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
             * 处理分类信息
             *
             * @param {object} article 文章
             * @return {string} 分类信息
             */
            getSubjectInfo(article) {
                let subjects = ''
                if (Array.isArray(article['Subjects'])) {
                    subjects = article['Subjects'].map(v => {
                        return `${v['Subject_Category_Name']}•${v['Subject_Name']}`
                    }).join('/')
                }
                return subjects
            },


            getMediaInfo(article) {
                let mediaType = article['Media_Type_Name'] === null ? '-' : article['Media_Type_Name']
                let domainName = article['Domain_Name'] === null ? '-' : article['Domain_Name']
                return `${mediaType}•${domainName}`
            },

            getMetaInfo(article) {
                let contents = []

                // 发布时间
                contents.push(this.getPublishTime(article))

                // 媒体类型
                let mediaType = article['Media_Type_Name'] === null ? '-' : article['Media_Type_Name']
                contents.push(mediaType)

                // 分类信息
                let subjects = ''
                if (Array.isArray(article['Subjects'])) {
                    subjects = article['Subjects'].map(v => {
                        return `${v['Subject_Category_Name']} · ${v['Subject_Name']}`
                    }).join('/')
                }
                contents.push(subjects)

                // 来源信息
                let domainName = article['Domain_Name'] === null ? '-' : article['Domain_Name']
                contents.push(domainName)
                return contents.join(' · ')
            },


            test(e) {
                let el = e.path[0]
                console.log(el)
                let org = el.className
                el.className = org + ' kwm-active'
                console.log(e)
                this.$nextTick(() => {


                })
                setTimeout(() => {
                    this.$router.push('/personal')
                    el.className = org
                }, 200)

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
    
    .classify-list {
        & .article-card {
            display: flex;
            background-color: #fff;
            padding: 8px 16px;
            margin-top: 8px;
            font-size: 14px;
            line-height: 1.8;

            &:first-child {
                margin-top: 0;
            }

            & .card-left {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            & .card-right {
                display: flex;
                flex-direction: column;
                min-width: 100%;
                min-height: 90px;

                & .article-content:active {
                    background-color: #e6e6e6;
                }

                & .article-title {
                    font-size: 1rem;
                    color: #000;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                }

                & .article-abstract {
                    margin-top: 8px;
                    color: #7d7e80;
                    font-size: 0.85rem;
                }

                & .article-tag {
                    & .article-tag {
                        margin-right: 4px;

                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }

                & .article-meta {
                    font-size: 0.80rem;
                    color: #444;
                    display: flex;
                    flex-direction: column;
                    // max-width: 100px;
                    box-sizing: border-box;


                    & .meta-item {
                        flex: 1;
                        display: block;
                        padding-right: 4px;
                        -webkit-box-orient: vertical;
                        -webkit-box-direction: normal;
                        line-height: 20px;
                        max-height: 20px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        &:last-child {
                            padding-right: 0;
                        }
                    }
                }

                & .article-actions {
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;


                    & .left-actions {
                        flex: 1;
                        display: flex;
                    }
                    & .right-actions {
                        display: flex;
                        align-self: flex-end;
                    }

                    & .article-action {
                        height: 30px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        flex: 1;

                        &:last-child {
                            justify-content: flex-end;
                        }
                        &:active {
                            background-color: #f5f5f5;
                        }
                    }

                }
            }
        }
    }
</style>
