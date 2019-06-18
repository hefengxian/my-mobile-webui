<template>
    <div class="ksm-article-detail">
        <van-nav-bar
            class="detail-nav"
            left-arrow
            @click-left="$router.back()"
        />
        <div class="detail-body">
            <van-skeleton
                title
                :row="5"
                :loading="loading"
            >
                <h2
                    v-html="title"
                    class="detail-title"></h2>
                <div class="detail-meta">
                    <van-cell-group>
                        <van-cell
                            :title="author"
                            :label="pubTime"
                            center
                            icon="user-o"
                        >
                        </van-cell>
                        <van-cell
                            title="原始信息"
                            center
                            icon="info-o"
                        >
                            <div slot="label">
                                <span>{{eTime}}</span>
                                <br>
                                <span>来源：{{article.Domain_Name}}</span>
                                <br>
                                <span>媒体：{{article.Media_Type_Name}}</span>
                            </div>
                        </van-cell>
                        <van-cell
                            title="操作信息"
                            center
                            icon="info-o"
                        >
                            <div slot="label">
                                <span>情感：</span>
                                <br>
                                <span>标签：</span>
                            </div>
                        </van-cell>
                    </van-cell-group>

                </div>
                <div
                    v-html="article.Article_Content"
                    class="detail-detail"></div>
            </van-skeleton>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Api from '../api/'
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

        mixins: [],

        components: {},

        props: {},

        data() {
            return {
                loading: true,
                article: {},
            }
        },

        computed: {
            author() {
                if (this.article.AC_Article_Author) {
                    return this.article.AC_Article_Author
                } else if (this.article.AD_Article_Author) {
                    return this.article.AD_Article_Author
                }
                return '-'
            },
            pubTime() {
                let time = this.$moment(this.article.Article_PubTime).fromNow()
                return `发布于：${time} ${this.article.Article_PubTime}`
            },
            eTime() {
                return `采集于：${this.article.Article_Extracted_Time}`
            },
            title() {
                return this.article.Article_Title
            }

        },

        watch: {},

        created() {
        },

        mounted() {
        },

        destroyed() {
        },

        methods: {
        },
        beforeRouteEnter(to, from, next) {
            Toast.loading({
                message: '加载中...'
            })
            Api.api.article.detail({id: to.params.id}).then(resp => {
                next(vm => {
                    Toast.clear()
                    vm.article = resp.data.result
                    vm.loading = false
                })
            }).catch(err => {
                alert(`出现了错误`)
                next(from)
            })
        }
    }
</script>

<style lang="less">
    .ksm-article-detail {
        height: 100vh;
        display: flex;
        flex-direction: column;

        & .detail-nav {

        }

        & .detail-body {
            flex: 1;
            overflow-y: auto;
            padding: 0 15px;
            background-color: #fff;
            
            & .detail-title {
                // text-align: center;
            }

            & .detail-meta {
                & .van-cell__label {
                    white-space: pre;
                }
                & .van-icon {
                    padding-right: 15px;
                }
            }

            & .detail-detail {
                margin-top: 25px;
                line-height: 1.8;
            }
        }
    }

</style>