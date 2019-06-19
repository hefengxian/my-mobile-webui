/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * 直接调用的标签选择组件
 *
 * @author: 𝑭𝒓𝒂𝒏𝒌 2019-06
 * @version 1.0
 */

import Vue from 'vue'
import TagSelector from './TagSelector'

const Constructor = Vue.extend(TagSelector)

let instance
let vm

function show(tgs, article) {
    if (!instance) {    // 保证一个组件内多次调用只有一个实例，避免渲染更多的 DOM
        instance = new Constructor()
        vm = instance.$mount()  // 先挂载
    }

    vm.tgs = tgs
    vm.article = article
    vm.initTags()
    vm.show = true

    return new Promise((resolve, reject) => {
        vm.$on('change', resolve)
    })
}

export default {
    show
}
