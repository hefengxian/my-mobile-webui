/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: 𝑭𝒓𝒂𝒏𝒌 2019-06-18 16-35
 * @version 1.0
 */

import Vue from 'vue'
import EmotionSelector from './EmotionSelector'

const Constructor = Vue.extend(EmotionSelector)

let instance
let vm

function show(article) {
    if (!instance) {
        instance = new Constructor()
        vm = instance.$mount()
    }

    vm.article = article
    vm.init()
    vm.show = true
}

export default {
    show
}
