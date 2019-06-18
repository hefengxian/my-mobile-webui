<template>
    <van-popup
        v-model="show"
        position="bottom"
        get-container="#app"
        class="ksm-tag-select">
        <div class="tag-list">

            <!-- 标签组 -->
            <van-tabs
                class="tags"
                :color="color">
                <van-tab
                    v-for="(group, gIndex) in tgs"
                    :key="group.class_id">
                    <div
                        slot="title"
                        class="group-title van-ellipsis">
                        {{group.class_name}}
                        <span
                            v-show="group._count > 0"
                            class="van-info">{{group._count}}</span>
                    </div>

                    <van-cell
                        v-for="(tag, tIndex) in group.tags"
                        :key="tag.Tag_ID"
                        :title="tag.Tag"
                        center
                        clickable
                        icon="bookmark-o"
                        @click="handleTagClick(gIndex, tIndex)">
                        <van-icon
                            v-show="tag._checked"
                            slot="right-icon"
                            name="checked"
                            :color="color"
                        />
                    </van-cell>
                </van-tab>
            </van-tabs>

            <!-- 底部按钮 -->
            <div class="tag-actions">
                <van-button
                    square
                    block
                    type="default"
                    @click="show = false">取消
                </van-button>
                <van-button
                    square
                    block
                    type="info"
                    @click="submit">确定
                </van-button>
            </div>
        </div>
    </van-popup>
</template>

<script>
    import Vue from 'vue'
    import {
        Cell,
        Icon,
        Popup,
        Button,
    } from 'vant'

    Vue.use(Icon)
        .use(Cell)
        .use(Popup)
        .use(Button)

    export default {
        name: "TagSelector",

        mixins: [],

        components: {},

        props: {},


        data() {
            return {
                color: '#1989fa',
                show: false,
                tgs: [],
                article: null,
                selectedTags: []
            }
        },

        computed: {
            articleTagIds() {
                return this.article.Tags.map(v => v.Tag_ID)
            },
            isSelected() {
                return this.article.User_Process_Status === 'S'
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
            /**
             * 初始化标签列表
             *
             * 将已选择的标签标记到列表上，在显示弹窗时候才调用
             */
            initTags(needSort = true) {
                this.tgs = this.tgs.map(g => {
                    let checkedCount = 0
                    g.tags = g.tags.map(t => {
                        t._checked = this.articleTagIds.indexOf(t.Tag_ID) > -1
                        if (t._checked) checkedCount++
                        return t
                    })
                    if (needSort) {
                        g.tags.sort((a, b) => {    // 排序，让已经选择的显示在前面
                            if (a._checked) {
                                return -1
                            }
                        })
                    }
                    g._count = checkedCount
                    return g
                })
            },


            /**
             * 点击某个标签，选择或者取消选择时，用于触发视图更新
             *
             * @param {number} gIndex 标签组的索引
             * @param {number} tIndex 标签的索引
             */
            handleTagClick(gIndex, tIndex) {
                let tags = this.tgs[gIndex]
                tags.tags[tIndex]._checked = !tags.tags[tIndex]._checked
                // 触发变动
                this.$set(this.tgs, gIndex, tags)
                this.updateSelectCount()
            },


            /**
             * 提交标签更改的数据，以及一些后续处理
             */
            submit() {
                // 获取当前已经选择的标签
                let currentSelectTags = []
                this.tgs.forEach(g => {
                    let ts = g.tags.filter(t => t._checked)
                    currentSelectTags = [...currentSelectTags, ...ts]
                })

                let currentSelectTagIds = currentSelectTags.map(t => t.Tag_ID)
                // 删除的标签 ID
                let removed = this.articleTagIds.filter(c => currentSelectTagIds.indexOf(c) < 0)
                // 添加的标签 ID
                let added = currentSelectTagIds.filter(c => this.articleTagIds.indexOf(c) < 0)

                // 请求服务端修改数据
                if (removed.length > 0) {
                    let params = {
                        Articles: this.article.Article_Detail_ID,
                        Tags: removed.join(','),
                    }
                    this.$api.article.removeTag(params)
                }
                if (added.length > 0) {
                    let params = {
                        Articles: this.article.Article_Detail_ID,
                        Tags: added.join(','),
                    }
                    this.$api.article.addTag(params)
                }


                // 立即更新界面数据，不等待
                if (!this.isSelected) {
                    // 如果是未选择，那么要变成选择状态，并且情感是中性
                    this.article.User_Process_Status = 'S'
                    this.article.User_Confirm_Emotion_Type = 0
                }
                this.article.Tags = currentSelectTags
                // 关闭标签选择窗口
                this.show = false
            },


            /**
             * 手动更新标签组已选的数量
             */
            updateSelectCount() {
                this.tgs = this.tgs.map(g => {
                    g._count = g.tags.filter(t => t._checked).length
                    return g
                })
            },
        }
    }
</script>

<style lang="less">
    .ksm-tag-select {
        height: 70%;
        background-color: #f5f5f5;

        & .tag-list {
            height: 100%;
            display: flex;
            flex-direction: column;

            & .tags {
                flex: 1;
                display: flex;
                flex-direction: column;

                & .group-title {
                    & .van-info {
                        top: 3px;
                        background-color: #1989fa;
                    }
                }

                & .van-tabs__content {
                    flex: 1;
                    overflow-y: auto;
                }
            }

            & .tag-actions {
                display: flex;
            }
        }
    }
</style>
