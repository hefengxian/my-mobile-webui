<template>
    <div class="ksm-search">
        <form action="/">
            <van-search
                v-model="keyword"
                placeholder="请输入搜索关键词"
                @search="onSearch"
            />
        </form>
        <div class="search-words">
            <template v-if="histories.length > 0">
                <van-cell
                    title="历史搜索">
                    <van-button
                        slot="right-icon"
                        class="clear-history"
                        icon="delete"
                        size="small"
                        @click="clearHistory"
                    />
                </van-cell>
                <div>
                    <div class="words history-words">
                        <van-tag
                            v-for="(word, index) in histories"
                            :key="index"
                            plain
                            type="primary"
                            @click="onKeywordClick(word)"
                        >{{word}}</van-tag>
                    </div>
                </div>
            </template>
            <van-cell title="核心词" />

            <div class="words focus-words">
                <van-tag
                    v-for="(word, index) in focusWords"
                    :key="index"
                    plain
                    type="primary"
                    @click="onKeywordClick(word)"
                >{{word}}</van-tag>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import CommonMixin from '../util/CommonMixin'
    import {
        NavBar,
        Tag,
        Icon,
        Skeleton,
        Search,
        Cell,
        Button,
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Skeleton)
        .use(Search)
        .use(Tag)
        .use(Cell)
        .use(Button)

    export default {
        name: "Search",
        mixins: [CommonMixin],
        data() {
            return {
                keyword: '',
                focusWords: [],
                histories: [],
            }
        },
        created(){
            let histories = this.$localStore.getItem(this.$localStore.keys.SEARCH_KEYWORD_HISTORY)
            if (histories) {
                this.histories = histories
            }
            this.initKeywords().then(words => {
                this.focusWords = words.focus
            })
        },
        methods: {
            onSearch() {
                console.log('on search')
                this.addHistory(this.keyword)
            },
            onCancel() {

            },
            addHistory(word) {
                if (typeof word === 'string' && word.trim() !== '') {
                    let histories = this.histories
                    histories = histories.filter(v => word !== v)
                    histories.splice(0, 0, word)
                    this.histories = histories.filter((v, k) => k < 10)
                    this.$localStore.setItem(this.$localStore.keys.SEARCH_KEYWORD_HISTORY, histories)
                }
            },
            onKeywordClick(word) {
                this.keyword = word
                this.addHistory(word)
            },
            clearHistory() {
                this.histories = []
                this.$localStore.setItem(this.$localStore.keys.SEARCH_KEYWORD_HISTORY, [])
            }
        }
    }
</script>

<style lang="less">
    .ksm-search {
        min-height: 100vh;
        background-color: #fff;

        & .search-words {

            & .words {
                padding: 15px;
            }

            & .clear-history {
                border: none;
            }

            & .van-tag {
                margin: 6px 4px;
            }
        }
    }
</style>