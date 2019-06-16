<template>
    <div
        :class="{'isRead': isReadOnly}"
        class="article-card">
        <div class="article-stats">
            <emotion
                class="article-stat"
                :article="a" />
            <van-icon
                v-if="isSelect"
                color="#07c160"
                size="20"
                class="article-stat"
                name="certificate" />

            <van-tag
                v-for="tag in a.Tags"
                :key="tag.Tag_ID"
                class="article-stat"
                color="#7232dd"
                plain>{{tag.Tag}}
            </van-tag>
        </div>
        <div class="card-left">
            <van-checkbox
                v-if="false"
                v-model="a._check"
                style="margin-right: 16px" />
        </div>
        <div class="card-right">
            <div class="article-content">
                <div
                    class="article-title"
                    v-html="a.Article_Title"></div>
                <div
                    class="article-abstract"
                    v-html="a.Article_Abstract"></div>
                <div class="article-meta">
                    <div class="meta-item">{{getMetaInfo(a)}}</div>
                </div>

            </div>

            <!-- 操作按钮 -->
            <div class="article-actions">
                <van-button
                    v-for="(action, index) in actions"
                    :key="index"
                    size="small"
                    style="border: none;"
                    :icon="action.icon"
                    square
                    :disabled="action.disabled"
                    loading-type="spinner"
                    loading-size="12"
                    :loading="action.loading"
                    block
                    type="default"
                    @click="action.onClick"
                >{{action.text}}</van-button>

            </div>
        </div>

        <!-- 情感 ActionSheet -->
        <van-action-sheet
            v-model="isShowEmotionSelectSheet"
            :actions="emotionActions"
            close-on-click-action
            get-container="#app"
            cancel-text="取消"
            @select="onEmotionActionSheetSelect"
        />
    </div>
</template>

<script>
    import Vue from 'vue'
    import Emotion from './Emotion'

    import {
        NavBar,
        Cell,
        CellGroup,
        Icon,
        Skeleton,
        Tag,
        Checkbox,
        ActionSheet,
        Toast,
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Skeleton)
        .use(Cell)
        .use(CellGroup)
        .use(Tag)
        .use(Checkbox)
        .use(ActionSheet)
        .use(Toast)

    export default {
        name: "ArticleItem",
        mixins: [],
        components: {
            Emotion
        },
        props: {
            article: {
                type: Object
            }
        },
        data() {
            return {
                a: this.article,
                isShowEmotionSelectSheet: false,
                emotionActions: [
                    {
                        key: 1,
                        name: '正面',
                    },
                    {
                        key: 0,
                        name: '中性',
                    },
                    {
                        key: -1,
                        name: '负面',
                    },
                ],
                isReadLoading: false,
                isSelectLoading: false,
                isTagLoading: false,
            }
        },
        computed: {
            isReadOnly() {
                // 仅仅是已读状态（不包含已选等其他操作）
                return ['U'/*, 'S', 'R'*/].indexOf(this.a['User_Process_Status']) > -1
            },
            isRead() {
                // 包括已选等状态
                return ['U', 'S', 'R'].indexOf(this.a['User_Process_Status']) > -1
            },
            isSelect() {
                return this.a['User_Process_Status'] === 'S'
            },
            actions() {
                return [
                    {
                        icon: 'eye-o',
                        disabled: this.isSelect,
                        loading: this.isReadLoading,
                        onClick: this.markAsRead,
                        text: this.isReadOnly ? '未读' : '已读'
                    },
                    {
                        icon: this.isSelect ? 'cross' : 'success',
                        disabled: false,
                        loading: this.isSelectLoading,
                        onClick: this.select,
                        text: this.isSelect ? '取消' : '选择'
                    },
                    {
                        icon: 'bookmark-o',
                        disabled: false,
                        loading: this.isTagLoading,
                        onClick: this.setTag,
                        text: '标签'
                    },
                    {
                        icon: 'ellipsis',
                        disabled: false,
                        loading: false,
                        onClick: this.more,
                        text: ''
                    },
                ]
            }
        },
        watch: {
            article(val) {
                this.a = val
            }
        },
        created() {
        },
        mounted() {
        },
        destroyed() {
        },
        methods: {
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
                    if (this.$moment(pubTime).isValid()) {
                        result = this.$moment(pubTime).fromNow()
                    }
                }
                return result
            },

            /**
             * 处理文章基本信息，方便展示
             *
             * @param {object} article
             * @returns {string}
             */
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

            /**
             * 标记已读、未读
             */
            markAsRead() {
                // 只有未读、或者仅仅是已读才可以操作
                let params = {
                    Ids: this.a.Article_Detail_ID
                }
                if (this.isReadOnly) {
                    // 标记成未读状态
                    this.isReadLoading = true
                    this.$api.article.cancelReadArticle(params).then(resp => {
                        // 使用本地的数据（远端数据可能有延迟，特别是在读写分离的时候）
                        this.a.User_Process_Status = 'N'
                        this.isReadLoading = false
                    })
                } else if (!this.isRead) {
                    // 未读文章，标记成已读
                    this.isReadLoading = true
                    this.$api.article.readArticle(params).then(resp => {
                        // 使用本地的数据（远端数据可能有延迟，特别是在读写分离的时候）
                        this.a.User_Process_Status = 'U'
                        this.isReadLoading = false
                    })
                } else {
                    Toast('已选信息不能修改阅读状态')
                }
            },


            /**
             * 选择文章、取消选择
             */
            select() {
                if (this.isSelect) {
                    // 取消选择
                    let params = {
                        Ids: this.a.Article_Detail_ID,
                        User_Process_Status: 'U'
                    }
                    this.isSelectLoading = true
                    this.$api.article.cancelSelectArticle(params).then(resp => {
                        // 使用本地的数据（远端数据可能有延迟，特别是在读写分离的时候）
                        this.a.User_Process_Status = 'U'
                        this.isSelectLoading = false
                    })
                } else {
                    this.isShowEmotionSelectSheet = true
                }
            },


            /**
             * 选择时选择情感之后的回调
             */
            onEmotionActionSheetSelect(action) {
                let params = {
                    Ids: this.a.Article_Detail_ID,
                    Emotion_Type: action.key,
                    User_Process_Status: 'S'
                }
                this.isSelectLoading = true
                this.$api.article.selectArticle(params).then(resp => {
                    // 使用本地的数据（远端数据可能有延迟，特别是在读写分离的时候）
                    this.a.User_Process_Status = 'S'
                    this.a.User_Confirm_Emotion_Type = action.key
                    this.isSelectLoading = false
                })
            },

            setTag() {

            },

            more() {

            },
        }
    }
</script>

<style lang="less">
    .classify-list {
        & .article-card {
            position: relative;
            display: flex;
            background-color: #fff;
            padding: 24px 16px 8px 16px;
            margin-top: 8px;
            font-size: 14px;
            line-height: 1.8;

            &.isRead {
                background-color: #f9f9f9;
                opacity: 0.4;
            }

            &:first-child {
                margin-top: 0;
            }

            & .article-stats {
                position: absolute;
                width: 100%;
                top: 4px;
                left: 0;
                display: flex;
                align-items: center;

                & .article-stat {
                    margin: 0 4px;

                    &:first-child {
                        margin-left: 0;
                    }
                }
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
                    // font-weight: bold;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                }

                & .article-abstract {
                    margin: 8px 0;
                    color: #444;
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
                            background-color: #e6e6e6;
                        }
                    }

                }
            }
        }
    }
</style>
