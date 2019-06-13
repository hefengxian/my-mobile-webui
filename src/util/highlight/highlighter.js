/**
 * Copyright © 2017-present, Knowlesys, Inc.
 * All rights reserved.
 *
 * @author= HFX 2017-12-25 10-34
 * @version 1.0
 */


export class HighLighter {

    /**
     * 构造器
     *
     * 在对象实例化的时候作预处理，当多次调用高亮的时候，无需重复处理
     *
     * @param {Array} options 配置项目，具体字段如 _default 中定义的
     */
    constructor(options = []) {
        if (!Array.isArray(options)) {
            console.error('options must be an Array.')
            return
        }

        // 默认的配置，用来合并用户的配置补全不完整的配置
        let _default = {
                words: [],                  // 关键词，数组
                element: 'mark',            // 包裹关键词的标签
                className: "",              // 包裹关键词的标签上的 class 样式名称
                accuracy: true,             // 是否精确匹配，默认为开启的：例如 or 不匹配 word （主要针对英文类的）
            },
            includeEnRegex = new RegExp('^[A-Za-z0-9_\\-\\+\\.]+$', "i")   // 匹配英文，用来筛选纯英文单词、字母或者数字

        // 用 Set 是为了排重
        let wordSet = new Set(),                // 普通的词
            accuracyWordSet = new Set()         // 要精确匹配的英文词

        this.wordsConfig = {}
        options.forEach(v => {
            let option = {..._default, ...v},
                config = {
                    element: option.element,
                    className: option.className
                }
            if (Array.isArray(option.words)) {
                option.words.forEach(v => {
                    v = String(v).trim().toLowerCase()
                    if (v !== '') {
                        // 将所有关键词的高亮信息用一个巨大的对象存起来（取的时候快）
                        // 将信息用 Object 存起来可以让多个共享一个引用
                        this.wordsConfig[v] = config

                        if (option.accuracy) {      // 是否精确匹配
                            if (includeEnRegex.test(v)) {
                                accuracyWordSet.add(v)
                            } else {
                                wordSet.add(v)
                            }
                        } else {
                            wordSet.add(v)
                        }
                    }
                })
            }
        })

        let regExpRegex = /[-[\]{}()*+?.,\\^$]/g
        // 转换成数组并按照字符串长度排序，最后拼接起来预备成为正则的模式
        let words = {
            normalWords: [...wordSet]
                .sort((a, b) => b.length - a.length)
                .join('|')
                .replace(regExpRegex, "\\$&"),
            accuracyWords: [...accuracyWordSet]
                .sort((a, b) => b.length - a.length)
                .join('|')
                .replace(regExpRegex, "\\$&")
        }
        // console.log(this.words)

        // 处理精确匹配的关键词正则
        this.accuracyWordsRegex = new RegExp(`(\\b)(${words.accuracyWords})(\\b)`, 'gi')
        // 处理普通的词的正则
        this.wordsRegex = new RegExp(`()(${words.normalWords})()`, 'gi')
    }


    /**
     * 高亮，外部要调用的方法
     *
     * @param {string} source 原始文本
     * @param {Boolean} hasTag 是否包含 HTML 标签（为了加速）
     * @return {string} 高亮之后的文本
     */
    highlight(source = '', hasTag = false) {
        if (typeof source !== 'string') {
            return source
        } else if (source.trim().length === 0) {
            return source
        }

        // 替换注释
        if (hasTag) {
            source = source.replace(/(<!--[\s\S]*?-->)/g, '')
        }

        source = this.regexReplace(source, this.wordsRegex, hasTag)
        source = this.regexReplace(source, this.accuracyWordsRegex, true)
        return source
    }


    /**
     * 高亮的核心方法，正则替换
     *
     * @param {string} source 要高亮的文本
     * @param {RegExp} regex 高亮的正则
     * @param {Boolean} hasTag 是否包含 HTML 标签（为了加速）
     * @return {string} 高亮处理之后的文本
     */
    regexReplace(source, regex, hasTag = false) {
        let last = 0,   // 指针
            // 不包含的标签正则
            excludeTagRegex = new RegExp('^<\/(script|style|textarea)>', 'gi'),
            result = '',
            // 替换函数的回调
            replaceCallBack = (match = '', p1, word = '', p2) => {
                word = word.trim().toLowerCase()
                if (word.length > 0) {
                    let element = this.wordsConfig[word]['element'],
                        className = this.wordsConfig[word]['className']
                    return `<${element} class="${className}">${word}</${element}>`
                }
                return ''
            }

        // 处理字符串（包含 Tag）
        if (hasTag) {
            while (last >= 0 && last < source.length) {
                let tagBeginPos = source.indexOf('<', last),
                    tagEndPos = source.indexOf('>', last),
                    part = '',
                    tag = ''

                if (tagBeginPos >= 0 && tagEndPos >= 0) {   // 存在成对的尖括号
                    tag = source.substring(tagBeginPos, tagEndPos + 1)
                    part = source.substring(last, tagBeginPos)
                    if (!excludeTagRegex.test(tag)) {
                        part = part.replace(regex, replaceCallBack)
                    }
                    result += (part + tag)
                    last = tagEndPos + 1
                } else {
                    part = source.substring(last)
                    part = part.replace(regex, replaceCallBack)
                    result += part
                    last = -1
                }
            }
        } else {
            // console.count('replace')
            result = source.replace(regex, replaceCallBack)
        }

        return result
    }
}
