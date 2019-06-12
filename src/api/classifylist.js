/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: 𝑭𝒓𝒂𝒏𝒌 2019-06-12 09-34
 * @version 1.0
 */

import api from './api-client'

export default {
    list(params) {
        return api.doRequest(`/v1/article-list`, api.GET, params)
    },
    listCount(params) {
        return api.doRequest(`/v1/article-list-count`, api.GET, params)
    },
}
