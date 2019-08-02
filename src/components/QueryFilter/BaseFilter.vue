<template>
    <div>
        <slot name="filter-title">
            <div class="block-title van-ellipsis">
                <div class="label">{{myFilter.title}}</div>
            </div>
        </slot>

        <van-row gutter="16">
            <van-col
                v-for="item in myFilter.data"
                :key="item.value"
                span="8">
                <van-button
                    block
                    square
                    size="small"
                    class="van-ellipsis filter-item"
                    :type="getButtonType(item.value)"
                    @click="handleItemClick(item.value)">{{item.label}}</van-button>
            </van-col>
            <slot name="self-define-btn"></slot>
        </van-row>

        <slot name="extra"></slot>
    </div>
</template>

<script>
    import Vue from 'vue'
    import QueryFilterMixin from './QueryFilterMixin'
    import {
        Row,
        Col,
    } from 'vant'

    Vue.use(Row)
        .use(Col)

    export default {
        name: "BaseFilter",

        mixins: [QueryFilterMixin],

        components: {

        },

        props: {
        },

        data() {
            return {
            }
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

        }
    }
</script>

<style>

</style>
