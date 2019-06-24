/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2018-11-08 16-07
 * @version 1.0
 */

import Axios from 'axios'

// const BASE_URL = 'http://192.168.1.45/php/kwm-next-server/api'
const BASE_URL = window.BASE_URL
Axios.defaults.baseURL = BASE_URL
const instance = Axios.create({
    baseURL: BASE_URL,
})


/**
 * HTTP 常用动词
 * @link http://www.ruanyifeng.com/blog/2014/05/restful_api.html
 */
const GET = 'get'                   // GET 请求，用于查询/读取服务器资源
const POST = 'post'                 // POST 请求，用于在服务器创建一个资源
const PUT = 'put'                   // PUT 请求，在服务器更新资源（客户端提供改变后的完整资源）
const PATCH = 'patch'               // PATCH 请求，在服务器更新资源（客户端提供改变的属性）
const DELETE = 'delete'             // DELETE 请求，从服务器删除资源


const api = {
    setAuthorization(token) {
        Axios.defaults.headers.common['Authorization'] = `${token.token_type} ${token.access_token}`
    },
    login(data = {}) {
        return instance.post('/public/access_token', data)
    },
    userInfo() {
        return Axios.request({
            url: '/v1/user-info',
            method: GET
        })
    },

    article: {
        // 文章列表
        articleList(params = {}) {
            return Axios.request({
                url: '/v1/article-list',
                method: GET,
                params,
            })
        },

        // 文章列表总数
        articleListCount(params = {}) {
            return Axios.request({
                url: '/v1/article-list-count',
                method: GET,
                params,
            })
        },

        // 详情
        detail(params) {
            return Axios.request({
                url: '/v1/article/detail',
                method: GET,
                params,
            })
        },

        // 删除文章
        deleteArticle(params = {}) {
            return Axios.request({
                url: '/v1/article',
                method: DELETE,
                params,
            })
        },

        // 标记文章已读状态
        readArticle(data = {}) {
            return Axios.request({
                url: '/v1/article/read',
                method: POST,
                data,
            })
        },

        // 取消已读文章状态
        cancelReadArticle(params = {}) {
            return Axios.request({
                url: '/v1/article/read',
                method: DELETE,
                params,
            })
        },

        // 选择文章
        selectArticle(data = {}) {
            return Axios.request({
                url: '/v1/article/select',
                method: POST,
                data,
            })
        },

        // 取消选择
        cancelSelectArticle(params = {}) {
            return Axios.request({
                url: '/v1/article/select',
                method: DELETE,
                params,
            })
        },

        // 获取高亮词
        highlightWords(params = {}) {
            return Axios.request({
                url: '/v1//article/highlight-keyword',
                method: GET,
                params,
            })
        },

        // 获取高亮词
        subjectTree(params = {}) {
            return Axios.request({
                url: '/v1/manage/class-manage/subject-tree',
                method: GET,
                params,
            })
        },

        // 添加 Tag
        addTag(data = {}) {
            return Axios.request({
                url: '/v1/article/tag',
                method: POST,
                data,
            })
        },

        // 删除 Tag
        removeTag(params = {}) {
            return Axios.request({
                url: '/v1/article/tag',
                method: DELETE,
                params,
            })
        },


        // 全库关键词搜索
        search(params = {}) {
            return Axios.request({
                url: '/v1/search',
                method: GET,
                params,
            })
        }
    },

    common: {
        selectHelper(entityNames, params = {}) {
            params['entity_name'] = entityNames
            return Axios.request({
                url: '/v1/select-helper',
                method: GET,
                params,
            })
        }
    },

    analysis: {

    },
}


export default {
    // 作为 Vue 插件
    install(Vue, options) {
        Vue.api = api
        Vue.prototype.$api = api
    },
    api
}
