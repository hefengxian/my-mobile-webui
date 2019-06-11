/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2019-04-15 18-36
 * @version 1.0
 */

import api from './api-client'

const PREFIX = '/v1/search/'

export default {
    list(params) {
        return api.doRequest(PREFIX + 'list', api.GET, params)
    },
    count(params) {
        return api.doRequest(PREFIX + 'count', api.GET, params)
    },
    articles(params) {
        return api.doRequest(PREFIX + 'articles', api.GET, params)
    },
    detail(params) {
        return api.doRequest(PREFIX + 'detail', api.GET, params)
    },
}
