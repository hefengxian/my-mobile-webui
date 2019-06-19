<template>
    <div class="ksm-article-detail">
        <van-nav-bar
            class="ksm-nav detail-nav"
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

            <!-- 导航右侧按钮 -->
            <div
                class="nav-actions right"
                slot="right">
                <van-button
                    v-for="btn in navButtons"
                    square
                    class="nav-action"
                    size="small"
                    :key="btn.icon"
                    :icon="btn.icon"
                    @click="btn.onClick"/>
            </div>
        </van-nav-bar>

        <!-- 页面主体 -->
        <div class="detail-body">
            <!-- 标题 -->
            <h2
                v-html="article.displayTitle"
                class="detail-title"></h2>

            <!-- 文章信息 -->
            <div class="detail-meta">
                <!-- 已选状态才展示的内容，已选情感，标签等 -->
                <div
                    v-if="isSelected"
                    class="stats">
                    <emotion
                        class="stat"
                        :article="article"/>
                    <van-icon
                        :color="activeColor"
                        size="20"
                        class="stat"
                        name="certificate"/>
                    <van-tag
                        v-for="tag in article.Tags"
                        :key="tag.Tag_ID"
                        class="stat"
                        :color="activeColor"
                        plain
                    >{{tag.Tag}}
                    </van-tag>
                </div>

                <!-- 文章信息，采集时间媒体类型等 -->
                <van-collapse
                    v-model="metaCollapse"
                    :border="false"
                    accordion>
                    <van-collapse-item
                        :title="author"
                        :label="pubTime"
                        center
                        class="van-hairline--surround"
                        icon="info-o"
                        name="1">
                        <div class="">
                            <van-cell-group
                                :border="false">
                                <van-cell
                                    v-for="item in metaItems"
                                    class="meta-item"
                                    :title="item.title"
                                    :value="item.value"
                                    center
                                />
                            </van-cell-group>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>

            <!-- 内容 -->
            <div
                v-html="article.displayContent"
                class="detail-detail"></div>

        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Api from '../api/'
    import Emotion from '../components/Emotion'
    import {isValidString} from "../util/assist"
    import CommonMixin from '../util/CommonMixin'
    import EmotionSelector from '../components/EmotionSelector'
    import TagSelector from '../components/TagSelector'
    import MoreActionSheet from '../components/MoreActionSheet'
    import {
        NavBar,
        Button,
        Icon,
        Skeleton,
        Toast,
        Cell,
        CellGroup,
        Tag,
        Collapse,
        CollapseItem,
    } from 'vant'

    Vue.use(NavBar)
        .use(Button)
        .use(Icon)
        .use(Skeleton)
        .use(Cell)
        .use(CellGroup)
        .use(Tag)
        .use(Collapse)
        .use(CollapseItem)

    export default {
        name: "ArticleDetail",

        mixins: [CommonMixin],

        components: {
            Emotion,
        },

        props: {},

        data() {
            return {
                loading: true,
                article: {},
                metaCollapse: '',
                activeColor: '#1989fa',

                // 用来监测文章是否有改动，已选、标签，删除等等
                isArticleChange: false,
                isArticleDelete: false,
            }
        },

        computed: {
            isSelected() {
                return this.article['User_Process_Status'] === 'S'
            },


            author() {
                let contents = []
                // 来源网站
                if (this.article.Domain_Name) {
                    contents.push(`${this.article.Domain_Name}`)
                }
                // 作者
                if (this.article.AC_Article_Author) {
                    contents.push(`${this.article.AC_Article_Author}`)
                } else if (this.article.AD_Article_Author) {
                    contents.push(`${this.article.AD_Article_Author}`)
                }

                return contents.join(' · ')
            },


            pubTime() {
                let pTime = this.$moment(this.article.Article_PubTime).fromNow()
                let contents = []
                contents.push(`${pTime}`)
                return contents.join('\n')
            },


            mentionArea() {
                let contents = []
                if (this.article.Country_Name) {
                    contents.push(this.article.Country_Name)
                }
                if (this.article.Province_Name) {
                    contents.push(this.article.Province_Name)
                }
                if (this.article.City_Name) {
                    contents.push(this.article.City_Name)
                }
                if (this.article.District_Name) {
                    contents.push(this.article.District_Name)
                }
                return contents.join(' · ')
            },


            classifyInfo() {
                if (!this.loading) {
                    return this.article.Subjects.map(s => {
                        return `${this.getEmotionText(s.Emotion_Type)} · ${s.Subject_Category_Name} · ${s.Subject_Name}`
                    }).join('\n')
                }
                return ''
            },


            metaItems() {
                let a = this.article
                let items = [
                    {
                        title: '采集时间',
                        value: a.Extracted_Time,
                    },
                    {
                        title: '发布时间',
                        value: a.Created_Time,
                    },
                    {
                        title: '分类时间',
                        value: a.Article_PubTime,
                    },
                    {
                        title: '媒体类型',
                        value: a.Media_Type_Name,
                    },
                    {
                        title: '所属分类',
                        value: this.classifyInfo,
                    },
                ]

                if (this.mentionArea.length > 0) {
                    items.push({
                        title: '提及地域',
                        value: this.mentionArea,
                    })
                }
                items.push({
                    title: '网站编号',
                    value: a.Website_No,
                })
                items.push({
                    title: '采集节点',
                    value: a.Node_ID,
                })
                return items
            },


            navButtons() {
                return [
                    {
                        icon: 'success',
                        onClick: () => {
                            EmotionSelector.show(this.article).then(() => {
                                this.isArticleChange = true
                            })
                        }
                    },
                    {
                        icon: 'bookmark-o',
                        onClick: () => {
                            TagSelector.show(this.tgs, this.article).then(() => {
                                this.isArticleChange = true
                            })
                        }
                    },
                    {
                        icon: 'share',
                        onClick: () => {
                            window.open(this.article.Article_URL)
                        }
                    },
                    {
                        icon: 'ellipsis',
                        onClick: () => {
                            MoreActionSheet.show(this.article).then(() => {
                                this.isArticleDelete = true
                                // 回到列表页面去
                                this.$router.back()
                            })
                        }
                    },
                ]
            },
        },

        watch: {},

        created() {
            this.initHighlighter(['focus', 'negative']).then(() => {
                if (!this.loading) {
                    this.highlight(this.article)
                }
            })
            this.initTgs().then(() => {
                // console.log('tgs init')
            })
        },

        mounted() {
        },

        destroyed() {
        },

        methods: {
            /**
             * 转换情感类型为可读文字
             *
             * @param {number} emotion 情感类型
             * @return {string}
             */
            getEmotionText(emotion) {
                let text = '中性'
                switch (emotion) {
                    case -1:
                        text = '负面'
                        break;
                    case 1:
                        text = '正面'
                        break;
                }
                return text
            },


            /**
             * 获取主内容，主要是详情和摘要的抉择
             *
             * @param {object} article 文章
             * @return {string}
             */
            getContent(article) {
                // 有内容就使用内容
                if (isValidString(article, 'Article_Content')) {
                    return article.Article_Content
                } else {
                    // alert('No content')
                }

                // 没有内容就使用摘要
                // 如果是 Article_Content 表有摘要就使用该表的摘要
                if (isValidString(article, 'AC_Article_Abstract')) {
                    return article.AC_Article_Abstract
                }
                // 否则使用 Article_Detail 的摘要
                if (isValidString(article, 'AD_Article_Abstract')) {
                    return article.AD_Article_Abstract
                }
                return ''
            },


            /**
             * 获取文章标题
             *
             * @param {object} article 文章
             * @return {string}
             */
            getTitle(article) {
                // 优先使用 Article_Content 表的标题
                if (isValidString(article, 'AC_Article_Title')) {
                    return article.AC_Article_Title
                }
                if (isValidString(article, 'AD_Article_Title')) {
                    return article.AD_Article_Title
                }
                return ''
            },


            /**
             * 处理文章
             *
             * @param {object} article 文章
             */
            initArticle(article) {
                article.displayTitle = this.getTitle(article)
                article.displayContent = this.getContent(article)
                this.article = article

                this.$nextTick(() => {
                    // 异步高亮
                    if (this.isHLLoaded) {
                        this.highlight(article)
                    }
                })
            },


            /**
             * 执行高亮
             *
             * @param {object} article 文章
             */
            highlight(article) {
                // console.log('highlighting...')
                this.article.displayTitle = this.highlighter.highlight(this.getTitle(article))
                this.article.displayContent = this.highlighter.highlight(this.getContent(article))
            }
        },
        beforeRouteEnter(to, from, next) {
            Toast.loading({message: '加载中...'})
            Api.api.article.detail({id: to.params.id}).then(resp => {
                let article = resp.data.result
                Toast.clear()
                next(vm => {
                    vm.initArticle(article)
                    vm.loading = false
                    vm.isArticleChange = false
                    vm.isArticleDelete = false
                })
            }).catch(err => {
                alert(`出现了错误`)
                next(from)
            })
        },
        beforeRouteLeave(to, from, next) {
            this.loading = true
            if (this.isArticleChange) {
                // 如果文章发生变动
                to.params.article = this.article
            }
            if (this.isArticleDelete) {
                // 如果文章已经删除
                to.params.delete = this.article.Article_Detail_ID
            }
            next()
        }
    }
</script>

<style lang="less">
    .ksm-article-detail {
        min-height: 100vh;
        display: flex;
        flex-direction: column;

        & .detail-nav {

        }

        & .detail-body {
            flex: 1;
            overflow: auto;
            padding: 50px 15px;
            background-color: #fff;

            & img {
                max-width: 100%;
            }

            & .detail-title {
                // text-align: center;
            }

            & .detail-meta {
                & .van-cell__label {
                    white-space: pre;
                }

                & .meta-item {
                    padding: 4px 15px;
                    font-size: 12px;

                    &:after {
                        // left: 0;
                    }

                    & .van-cell__title {
                        flex: none;
                        width: 100px;
                    }

                    & .van-cell__value {
                        white-space: pre-line;
                    }
                }

                & .van-collapse .van-icon {
                    padding-right: 15px;
                }

                & .stats {
                    height: 40px;
                    display: flex;
                    overflow: auto;
                    align-items: center;

                    & .stat {
                        margin: 0 4px;
                        word-break: keep-all;

                        &:first-child {
                            margin-left: 0;
                        }
                    }
                }

            }

            & .detail-detail {
                margin-top: 25px;
                line-height: 1.8;
                width: 100%;
                word-break: break-word;
                word-wrap: break-word;
                white-space: normal;
            }

            & .detail-footer {
                height: 50px;
            }
        }
    }

</style>
