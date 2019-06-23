<template>
    <div class="ksm-search">
        <form action="/">
            <van-search
                v-model="keyword"
                placeholder="使用关键词全库搜索"
                @search="onSearch"
            />
        </form>
        <div class="search-words">
            <template v-if="histories.length > 0">
                <van-cell
                    :border="false"
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
                        <van-button
                            v-for="(word, index) in histories"
                            :key="index"
                            plain
                            round
                            size="mini"
                            class="word"
                            @click="onKeywordClick(word)"
                        >{{word}}</van-button>
                    </div>
                </div>
            </template>

            <van-cell
                title="核心词"
                :border="false">
                <span
                    v-show="focusWords.length > 0"
                    slot="label">{{`共 ${focusWords.length} 个，已展示 ${currentShowWords.length} 个`}}</span>
            </van-cell>
            <div class="words focus-words">
                <van-button
                    v-for="(word, index) in currentShowWords"
                    :key="index"
                    plain
                    size="mini"
                    round
                    class="word"
                    @click="onKeywordClick(word)"
                >{{word}}</van-button>
                <van-button
                    v-if="hasMore"
                    plain
                    size="mini"
                    type="info"
                    round
                    class="word"
                    @click="moreWords()">
                    更多...
                </van-button>
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

    const SIZE = 20

    export default {
        name: "Search",
        mixins: [CommonMixin],
        data() {
            let u = this.$localStore.getItem(this.$localStore.keys.USER_KEY)
            return {
                u,
                keyword: '',
                focusWords: [],
                currentShowWords: [],
                histories: [],
            }
        },
        computed: {
            hasMore() {
                return this.focusWords.length > this.currentShowWords.length
            }
        },
        created(){
            let histories = this.$localStore.getItem(this.$localStore.keys.SEARCH_KEYWORD_HISTORY)
            if (histories) {
                this.histories = histories
            }
            this.initKeywords().then(words => {
                this.focusWords = words.focus
                this.currentShowWords = words.focus.slice(0, SIZE)
            })
        },
        activated() {
            let u = this.$localStore.getItem(this.$localStore.keys.USER_KEY)
            if (u.User_ID !== this.u.User_ID) {
                this.u = u
                let histories = this.$localStore.getItem(this.$localStore.keys.SEARCH_KEYWORD_HISTORY)
                if (histories) {
                    this.histories = histories
                }
                this.initKeywords().then(words => {
                    this.focusWords = words.focus
                    this.currentShowWords = words.focus.slice(0, SIZE)
                })
            }
        },
        methods: {
            onSearch() {
                this.addHistory(this.keyword)
                this.$router.push({path: '/search-list', query: {keyword: this.keyword}})
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
                this.onSearch()
            },
            clearHistory() {
                this.histories = []
                this.$localStore.setItem(this.$localStore.keys.SEARCH_KEYWORD_HISTORY, [])
            },
            moreWords() {
                if (this.hasMore) {
                    let start = this.currentShowWords.length
                    let end = start + SIZE
                    this.currentShowWords = this.currentShowWords.concat(this.focusWords.slice(start, end))
                }
            }
        }
    }
</script>

<style lang="less">
    .ksm-search {
        min-height: 100vh;
        background-color: #fff;

        & .search-words {

            & .van-cell:after {
                // border: none;
            }

            & .words {
                padding: 15px;
            }

            & .clear-history {
                border: none;
            }

            & .word {
                margin: 6px 4px;
            }
        }
    }
</style>
