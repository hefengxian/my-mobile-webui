<template>
    <base-filter
        :query="myQuery"
        :filter="myFilter"
        @change="handleChange">
        <slot
            name="filter-title"
            slot="filter-title">
            <div class="block-title van-ellipsis">
                <div class="label">{{myFilter.title}}</div>
                <div
                    v-if="isShowSelfDefineTitle"
                    class="van-ellipsis">{{myQuery[myFilter.value]}}</div>
            </div>
        </slot>

        <van-col
            v-if="myFilter.datePicker"
            slot="self-define-btn"
            span="8">
            <van-button
                square
                :type="selfDefineButtonType"
                @click="myFilter.datePicker.show = !myFilter.datePicker.show"
                size="small"
                class="van-ellipsis filter-item"
                block>自定义...</van-button>
        </van-col>

        <date-range-picker
            v-show="myFilter.datePicker.show"
            slot="extra"
            :value="myQuery[myFilter.value]"
            class="filter-item"
            @cancel="myFilter.datePicker.show = false"
            @confirm="handleDateRangeConfirm"
        />
    </base-filter>
</template>

<script>
    import Vue from 'vue'
    import QueryFilterMixin from './QueryFilterMixin'
    import BaseFilter from './BaseFilter'
    import DateRangePicker from '../DateRangePicker'

    import {
        Row,
        Col,
    } from 'vant'

    Vue.use(Row)
        .use(Col)

    export default {
        name: "BaseDatePickerFilter",

        mixins: [QueryFilterMixin],

        components: {
            BaseFilter,
            DateRangePicker,
        },

        props: {},

        data() {
            return {}
        },

        computed: {

        },

        watch: {},

        created() {
        },

        mounted() {
        },

        destroyed() {
        },

        methods: {
            handleChange(val) {
                this.$emit('change', val)
            },

            handleDateRangeConfirm(val) {
                this.myQuery[this.myFilter.value] = val
                this.myFilter.datePicker.show = false
                this.handleChange(this.myQuery)
            }
        }
    }
</script>

<style>

</style>
