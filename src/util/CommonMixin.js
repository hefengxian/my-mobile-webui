/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: 𝑭𝒓𝒂𝒏𝒌 2019-06-19 16-47
 * @version 1.0
 */

import HLFactory from './highlight/highlighter-factory'

export default {
    data() {
        return {
            isHLLoaded: false,
            highlighter: null,

            // 标签组
            tgs: [],
            isTgsLoaded: false,
        }
    },
    methods: {
        /**
         * 初始化高亮工具
         *
         * @param {[]} types 要高亮的词性，默认高亮 核心词
         * @param {boolean} reloadKeywords 是否要刷新关键词
         */
        initHighlighter(types = ['focus'], reloadKeywords = false) {
            // 从缓存中获取高亮词
            let words = this.$localStore.getItem(this.$localStore.keys.HL_WORDS)
            if (words && !reloadKeywords) {
                // 存在缓存，且不刷新关键词
                return Promise.resolve(this._doInitHighlighter(words, types))
            } else {
                // 没有缓存
                this.$api.article.highlightWords().then(resp => {
                    words = resp.data
                    this.$localStore.setItem(this.$localStore.keys.HL_WORDS, words)
                    return Promise.resolve(this._doInitHighlighter(words, types))
                })
            }
        },


        /**
         * 过滤要高亮的词，并实例化高亮工具
         *
         * @param {object} words 关键词表
         * @param {[]} types 要高亮的词的类型
         *
         * @private
         */
        _doInitHighlighter(words, types) {
            // 只保留 types 定义的词性进行高亮
            let needHLWords = {}
            types.forEach(t => {
                needHLWords[t] = words[t]
            })
            this.highlighter = HLFactory.getInstance(needHLWords)
            this.isHLLoaded = true
        },


        /**
         * 获取标签列表
         *
         * @param {boolean} refresh 是否刷新缓存
         */
        initTgs(refresh = false) {
            // 从缓存中获取高亮词
            let tgs = this.$localStore.getItem(this.$localStore.keys.TGS_KEY)
            if (tgs && !refresh) {
                this.tgs = tgs
                this.isTgsLoaded = true
                return Promise.resolve()
            } else {
                let action = 'tag_list'
                this.$api.common.selectHelper(action).then(resp => {
                    tgs = resp.data.result[action]
                    tgs = Object.values(tgs)
                    this.$localStore.setItem(this.$localStore.keys.TGS_KEY, tgs)
                    this.tgs = tgs
                    this.isTgsLoaded = true
                    return Promise.resolve()
                })
            }
        },
    }
}
