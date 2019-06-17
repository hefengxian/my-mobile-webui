<template>
    <van-popup
        v-model="show"
        position="bottom"
        get-container="#app"
        class="ksm-tag-select">
        <div class="tag-list">
            <van-tabs
                class="tags"
                color="#1989fa">


                <van-tab
                    v-for="(group, gIndex) in _tgs"
                    :key="group.class_id">
                    <div
                        slot="title"
                        class="van-ellipsis">
                        {{group.class_name}}
                        <span
                            v-if="group._count > 0"
                            class="van-info"
                            style="top: 3px">{{group._count}}</span>
                    </div>

                    <van-cell
                        v-for="(tag, tIndex) in group.tags"
                        :key="tag.Tag_ID"
                        :title="tag.Tag"
                        center
                        clickable
                        icon="bookmark-o"
                        @click="handleTagClick(tag)">
                        <van-icon
                            v-if="tag._checked"
                            slot="right-icon"
                            name="checked"
                            color="#1989fa"
                        />
                    </van-cell>
                </van-tab>
            </van-tabs>

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
                    @click="setTag"
                >确定
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
                show: false,
                tgs: [],
                article: null,
                needSort: true
            }
        },

        computed: {
            articleTagIds() {
                return this.article.Tags.map(v => v.Tag_ID)
            },
            _tgs() {
                console.log('_changed')
                let tgs = this.tgs.map(g => {
                    let checkedCount = 0
                    g.tags = g.tags.map(t => {
                        t._checked = this.articleTagIds.indexOf(t.Tag_ID) > -1
                        if (t._checked) checkedCount++
                        return t
                    })
                    if (this.needSort) {
                        g.tags.sort((a, b) => {
                            if (a._checked) {
                                return -1
                            }
                        })
                    }

                    g._count = checkedCount
                    return g
                })
                return tgs
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

            handleTagClick(tag) {
                this.needSort = false
                if (tag._checked) {
                    this.article.Tags = this.article.Tags.filter(t => t.Tag_ID !== tag.Tag_ID)
                } else {
                    this.article.Tags.push(tag)
                }
            },

            setTag() {
                let currentSelectTags = []
                this.tgs.forEach(g => {
                    let ts = g.tags.filter(t => t._checked)
                    currentSelectTags = [...currentSelectTags, ...ts]
                })

                let currentSelectTagIds = currentSelectTags.map(t => t.Tag_ID)
                let removed = this.articleTagIds.filter(c => currentSelectTagIds.indexOf(c) < 0)
                let added = currentSelectTagIds.filter(c => removed.indexOf(c) < 0)

                if (removed.length > 0) {
                    this.$api.article.removeTag({Articles: this.article.Article_Detail_ID, Tags: removed.join(',')})
                }
                if (added.length > 0) {
                    this.$api.article.addTag({Articles: this.article.Article_Detail_ID, Tags: added.join(',')})
                }
                this.article.Tags = currentSelectTags
                this.show = false
            },
        }
    }
</script>

<style>

</style>