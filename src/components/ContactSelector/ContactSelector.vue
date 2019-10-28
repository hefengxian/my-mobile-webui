<template>
    <van-popup
        v-model="show"
        position="bottom"
        get-container="#app"
        class="ksm-contact-select">
        <div class="contact-list">
            <div class="contact-title van-hairline--bottom">
                <div class="left"></div>
                <div class="center">选择接收人</div>
                <div class="right">
                    <van-button
                        type="default"
                        plain
                        style="border: none; color: #1989fa"
                        size="small"
                        icon="replay" />
                </div>
            </div>
            <div class="contacts">
                <van-cell
                    v-for="(addr, aIndex) in data"
                    :key="addr.User_ID"
                    :title="addr.value"
                    :value="addr.User_Name"
                    center
                    clickable
                    icon="manager-o"
                    @click="() => {}">
                    <van-icon
                        v-show="addr._checked"
                        slot="right-icon"
                        name="checked"
                        :color="color"
                    />
                </van-cell>
            </div>

            <!-- 底部按钮 -->
            <div class="contact-actions">
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
        name: "ContactSelector",

        mixins: [],

        components: {},

        props: {},


        data() {
            return {
                color: '#1989fa',
                data: [],
                show: false,

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
            init(type) {
                this.data = this.data.map(v => {
                    if (type === 'E') {
                        v.value = v.Email_Address
                    } else {
                        v.value = v.Mobile_No
                    }
                    return v
                }).filter(v => {
                    if (type === 'E') {
                        // 要求 Email 地址不能为空的才显示
                        return v.Email_Address != null
                    } else {
                        // 要求电话号码不为空才可以显示
                        return v.Mobile_No != null
                    }
                })
                console.log(this.data)
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
                this.$emit('change')
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
    .ksm-contact-select {
        height: 70%;
        background-color: #f5f5f5;

        & .contact-list {
            height: 100%;
            display: flex;
            flex-direction: column;

            & .contact-title {
                height: 50px;
                background-color: #fff;
                display: flex;
                flex-direction: row;
                align-items: center;

                & .left {
                    flex: 1;
                }
                & .center {
                    flex: 2;
                    text-align: center;
                }
                & .right {
                    flex: 1;
                    text-align: right;
                }
            }

            & .contacts {
                flex: 1;
            }

            & .contact-actions {
                display: flex;
            }
        }
    }
</style>
