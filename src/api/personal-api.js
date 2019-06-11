/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2018-08-08 18-07
 * @version 1.0
 */

import api from './api-client'

const PREFIX = '/v1/personal/'

export default {
    stat(params) {
        return api.doRequest(PREFIX + 'stat', api.GET, params)
    },
    changePassword(data) {
        return api.doRequest(PREFIX + 'change-password', api.PUT, null, data)
    },
}
