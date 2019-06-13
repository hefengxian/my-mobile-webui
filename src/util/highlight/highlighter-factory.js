/**
 * Copyright © 2017-present, Knowlesys, Inc.
 * All rights reserved.
 *
 * @author: HFX 2017-12-27 10-28
 * @version 1.0
 */

import {HighLighter} from './highlighter'

export default {
    /**
     * 获取高亮组件的实例
     *
     * @param {object} keywords 各种类型的关键词
     *
     * return {HighLighter}
     */
    getInstance(keywords = {}) {
        let _defaultKeywords = {
            extractSearch: [],      // 采集搜索词
            focus: [],              // 核心词
            positive: [],           // 正面词
            negative: [],           // 负面词
            exclude: [],            // 排除词
            black: [],              // 黑名单
            search: '',             // 实时搜索的关键词
        }
        keywords = {..._defaultKeywords, ...keywords}

        let keywordConfig = []
        // 高亮优先级：
        // 1. 实时搜索关键词
        // 2. 核心词
        // 3. 负面词
        // 4. 正面词
        // 5. 排除词
        // 6. 黑名单
        // 7. 采集搜索词

        // 采集搜索词
        if (Array.isArray(keywords.extractSearch) && keywords.extractSearch.length > 0) {
            keywordConfig.push({
                words: keywords.extractSearch,
                element: 'span',
                className: 'keyword-extract-search',
            })
        } else if (typeof keywords.extractSearch === 'string' && keywords.extractSearch.trim() !== '') {
            let esWords = keywords.extractSearch.trim().split(/\s+/)
            keywordConfig.push({
                words: esWords,
                element: 'span',
                className: 'keyword-extract-search',
            })
        }

        // 黑名单
        keywordConfig.push({
            words: keywords.black,
            element: 'span',
            className: 'keyword-black-list',
        })

        // 排除词
        keywordConfig.push({
            words: keywords.exclude,
            element: 'span',
            className: 'keyword-exclude',
        })

        // 正面词
        keywordConfig.push({
            words: keywords.positive,
            element: 'span',
            className: 'keyword-positive',
        })

        // 负面词
        keywordConfig.push({
            words: keywords.negative,
            element: 'span',
            className: 'keyword-negative',
        })

        // 核心词
        keywordConfig.push({
            words: keywords.focus,
            element: 'span',
            className: 'keyword-focus',
        })

        // 实时搜索词
        if (typeof keywords.search === 'string' && keywords.search.trim() !== '') {
            let sWords = keywords.search.trim().split(/\s+/)
            keywordConfig.push({
                words: sWords,
                element: 'span',
                className: 'keyword-search',
            })
        }

        return new HighLighter(keywordConfig)
    }
}
