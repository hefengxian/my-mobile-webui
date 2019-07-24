/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: 𝑭𝒓𝒂𝒏𝒌 2019-06-19 16-47
 * @version 1.0
 */

import HLFactory from './highlight/highlighter-factory'
import ButtonTabBar from '../components/ButtonTabBar'

export default {
    components: {
        ButtonTabBar
    },
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
         * @param {string} search 搜索关键词
         * @param {boolean} reloadKeywords 是否要刷新关键词
         */
        initHighlighter(types = ['focus'], search = '', reloadKeywords = false) {
            // 从缓存中获取高亮词
            return this.initKeywords(reloadKeywords).then(words => {
                if (search.trim().length > 0) {
                    // 带搜索词
                    words.search = search
                    types.push('search')
                }
                this._doInitHighlighter(words, types)
                return Promise.resolve(this.highlighter)
            })
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
         * @returns {Promise<any>}
         */
        initTgs(refresh = false) {
            // 从缓存中获取高亮词
            let tgs = this.$localStore.getItem(this.$localStore.keys.TGS_KEY)
            if (tgs && !refresh) {
                this.tgs = tgs
                this.isTgsLoaded = true
                return Promise.resolve(tgs)
            } else {
                let action = 'tag_list'
                this.$api.common.selectHelper(action).then(resp => {
                    tgs = resp.data.result[action]
                    tgs = Object.values(tgs)
                    this.$localStore.setItem(this.$localStore.keys.TGS_KEY, tgs)
                    this.tgs = tgs
                    this.isTgsLoaded = true
                    return Promise.resolve(tgs)
                })
            }
        },


        /**
         * 初始化各种词
         *
         * @param {boolean} refresh 是否刷新缓存
         * @returns {Promise<any>}
         */
        initKeywords(refresh = false) {
            // 从缓存中获取高亮词
            let words = this.$localStore.getItem(this.$localStore.keys.HL_WORDS)
            if (words && !refresh) {
                // 存在缓存，且不刷新关键词
                return Promise.resolve(words)
            } else {
                // 没有缓存
                return this.$api.article.highlightWords().then(resp => {
                    words = resp.data
                    this.$localStore.setItem(this.$localStore.keys.HL_WORDS, words)
                    return Promise.resolve(words)
                })
            }
        },


        /**
         * 获取头像图片名称
         *
         * @param {object} user
         * @return {string}
         */
        getAvatarURI(user) {
            let name = 'avatar.svg'
            switch (user.Gender) {
                case 'M':
                    name = 'male.svg'
                    break
                case 'F':
                    name = 'female.svg'
                    break
                default:
                    name = 'avatar.svg'
                    break
            }
            return name
        },
    }
}
