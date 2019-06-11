/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * 整个系统通用的 API 在此处定义，需要认证；
 * 比如：用户，权限等等信息
 *
 * @author: HFX 2018-08-09 18-31
 * @version 1.0
 */

import api from './api-client'

const PREFIX = '/v1/system/'

export default {
    userInfo() {
        return api.doRequest('/v1/user-info', api.GET)
    },
    privileges() {
        return api.doRequest(PREFIX + 'privileges', api.GET)
    },
    languages() {
        return api.doRequest(PREFIX + 'languages', api.GET)
    },
    currentGroupUser() {
        return api.doRequest(PREFIX + 'current-group-user', api.GET)
    },
    users(params) {
        return api.doRequest(PREFIX + 'users', api.GET, params)
    },
    groups() {
        return api.doRequest(PREFIX + 'groups', api.GET)
    },
    roles() {
        return api.doRequest(PREFIX + 'roles', api.GET)
    },
}
