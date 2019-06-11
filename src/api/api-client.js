/**
 * Copyright © 2017-present, Knowlesys, Inc.
 * All rights reserved.
 *
 * 最终发送 AJAX 请求的
 *
 * @author: HFX 2017-05-10 14-16
 * @version 1.0
 */


import axios from 'axios'

/**
 * HTTP 常用动词
 * @link http://www.ruanyifeng.com/blog/2014/05/restful_api.html
 */
const GET = 'get'                   // GET 请求，用于查询/读取服务器资源
const POST = 'post'                 // POST 请求，用于在服务器创建一个资源
const PUT = 'put'                   // PUT 请求，在服务器更新资源（客户端提供改变后的完整资源）
const PATCH = 'patch'               // PATCH 请求，在服务器更新资源（客户端提供改变的属性）
const DELETE = 'delete'             // DELETE 请求，从服务器删除资源

axios.defaults.baseURL = window.BASE_URL

export default {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,

    /**
     * 使用 axios 发送 Ajax 请求
     *
     * @link https://github.com/mzabriskie/axios
     *
     * @param {string} url 请求地址
     * @param {string} action 请求类型，如上枚举的类型
     * @param {object} params 请求（URL）参数
     * @param {object} data 数据（PUT, POST 请求才设置）
     *
     * @return {AxiosPromise} Promise 对象
     */
    doRequest(url, action = GET, params = {}, data = null) {
        let axiosConfig = {
            url,
            method: action,
            params,
            data,
            // timeout: 60 * 1000,
        }

        return axios.request(axiosConfig)
    },


    /**
     * 为 Axios 设置请求头
     *
     * @param oauth OAuth 信息；结构如下：
     * {
     *     token_type: 'Bearer',
     *     expires_in: 123,
     *     access_token: '...',
     *     refresh_token: '...',
     * }
     */
    setAuthorization(oauth) {
        let tokenType = oauth['token_type'],
            accessToken = oauth['access_token'],
            authorization = tokenType + ' ' + accessToken
        axios.defaults.headers.common['Authorization'] = authorization
    },
}
