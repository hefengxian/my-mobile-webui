<template>
    <van-action-sheet
        v-model="show"
        :actions="actions"
        class="ksm-more-action"
        close-on-click-action
        get-container="#app"
        cancel-text="取消"
        @select="onSelect"
    />
</template>

<script>
    import Vue from 'vue'
    import router from '../../router/router'
    import {
        ActionSheet,
        Dialog,
    } from 'vant'

    Vue.use(ActionSheet)

    export default {
        name: "MoreActionSheet",
        router,     // 手动 $mount 的组件必须要手工注册 Router 才可以使用路由
        mixins: [],
        components: {},
        props: {},
        data() {
            return {
                show: false,
                article: null,
                actions: [],
            }
        },
        computed: {
            isSelected() {
                return this.article.User_Process_Status === 'S'
            },
        },
        watch: {},
        created() {
        },
        mounted() {
        },
        destroyed() {
        },
        methods: {
            /**
             * 初始化菜单，不同的文章选择状态可能不一样，菜单也会不一样
             */
            init() {
                this.actions = [
                    {
                        key: 'alert',
                        name: '预警',
                        disabled: false
                    },
                    {
                        key: 'delete',
                        name: '删除',
                        disabled: this.isSelected       // 已选不能直接删除
                    },
                ]
            },


            /**
             * 点击操作菜单之后
             *
             * @param {object} action 菜单项
             */
            onSelect(action) {
                switch (action.key) {
                    case 'delete':
                        // 删除文章
                        this.deleteArticle()
                        break;
                    case 'alert':
                        this.$router.push({
                            name: 'Alert',
                            params: this.article
                        })
                        break;
                }
            },


            /**
             * 删除文章，并触发事件
             */
            deleteArticle() {
                Dialog.confirm({
                    title: '删除文章',
                    message: `确定要删除文章《${this.article.Article_Title}》`
                }).then(() => {
                    this.$api.article.deleteArticle({Ids: this.article.Article_Detail_ID}).then(resp => {
                        // 删除之后
                        this.$emit('delete')
                    })
                }).catch(() => {
                })
            }
        }
    }
</script>

<style lang="less">
    .ksm-more-action {
    }
</style>
