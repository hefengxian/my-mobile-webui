/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2018-08-08 18-07
 * @version 1.0
 */

import api from './api-client'

const PREFIX = '/v1/dashboard/'

export default {
    operationData() {
        return api.doRequest(PREFIX + 'operation-data', api.GET)
    },
    recentSummary() {
        return api.doRequest(PREFIX + 'recent-summary', api.GET)
    },
}