/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * 无需认证的 API
 *
 * @author: HFX 2018-08-09 14-17
 * @version 1.0
 */

import axios from 'axios'

const PREFIX = '/public/'

// axios 的实例，为了不受全局设置的影响
const instance = axios.create({
    baseURL: window.BASE_URL + PREFIX
})


export default {
    // 登录 API
    login(data) {
        return instance.post('access_token', data)
    }
}

