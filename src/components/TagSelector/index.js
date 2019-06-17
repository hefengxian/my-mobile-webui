

import Vue from 'vue'
import TagSelector from './TagSelector'

const TagSelectorConstructor = Vue.extend(TagSelector)

let instance
let vm

function show(tgs, article) {
    if (!instance) {
        instance = new TagSelectorConstructor()
        vm = instance.$mount()
    }

    vm.tgs = tgs
    vm.article = article
    vm.needSort = true
    vm.show = true
}

export default {
    show,
}