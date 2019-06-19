<template>
    <van-action-sheet
        v-model="show"
        class="ksm-emotion-selector"
        :actions="actions"
        close-on-click-action
        get-container="#app"
        cancel-text="取消"
        @select="onSelect"
    />
</template>

<script>
    import Vue from 'vue'
    import {ActionSheet} from 'vant'

    Vue.use(ActionSheet)

    const CANCEL_KEY = 99

    export default {
        name: "EmotionSelector",
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
                let actions = [
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
                ]
                if (this.isSelected) {
                    actions.push({
                        key: CANCEL_KEY,
                        name: '取消选择',
                    })
                }
                this.actions = actions
            },


            /**
             * 点击操作菜单之后
             *
             * @param {object} action 菜单项
             */
            onSelect(action) {
                if (action.key === CANCEL_KEY) {
                    // 取消选择
                    let params = {
                        Ids: this.article.Article_Detail_ID,
                        User_Process_Status: 'U'
                    }
                    this.$api.article.cancelSelectArticle(params).then(resp => {
                        // 使用本地的数据（远端数据可能有延迟，特别是在读写分离的时候）
                    })
                    this.article.User_Process_Status = 'U'
                    // 取消选择的时候要清理标签
                    this.article.Tags = []
                } else {
                    // 选择 or 更改情感
                    let params = {
                        Ids: this.article.Article_Detail_ID,
                        Emotion_Type: action.key,
                        User_Process_Status: 'S'
                    }
                    this.$api.article.selectArticle(params).then(resp => {
                        // 使用本地的数据（远端数据可能有延迟，特别是在读写分离的时候）
                    })
                    this.article.User_Process_Status = 'S'
                    this.article.User_Confirm_Emotion_Type = action.key
                }
                this.$emit('change')
            }
        }
    }
</script>

<style lang="less">
    .ksm-emotion-selector{}
</style>
