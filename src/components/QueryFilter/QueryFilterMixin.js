/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: 𝑭𝒓𝒂𝒏𝒌 2019-07-30 14-21
 * @version 1.0
 */

import DateRangePicker from '../DateRangePicker'

export default {
    components: {
        DateRangePicker
    },

    props: {
        filter: {
            type: Object
        },
        query: {
            type: Object
        }
    },

    data() {
        return {
            activeColor: '#1989fa',
            myFilter: this.filter,
            myQuery: this.query
        }
    },

    computed: {
        selfDefineButtonType() {
            return this.myFilter.datePicker.isSelect(this.myQuery[this.myFilter.value]) ? 'info' : 'default'
        },
        isShowSelfDefineTitle() {
            return this.myFilter.datePicker && this.myFilter.datePicker.isSelect(this.myQuery[this.myFilter.value])
        }
    },

    watch: {
        filter(val) {
            this.myFilter = val
        },
        query(val) {
            this.myQuery = val
        }
    },

    created() {
    },

    mounted() {
    },

    destroyed() {
    },

    methods: {
        getButtonType(val) {
            return val === this.myQuery[this.myFilter.value] ? 'info' : 'default'
        },

        handleItemClick(val) {
            this.myQuery[this.myFilter.value] = val
            this.$emit('change', this.myQuery)
        }
    }
}
