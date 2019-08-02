<template>
    <base-date-picker-filter
        :filter="myFilter"
        :query="myQuery">
        <div
            slot="filter-title"
            class="block-title van-ellipsis switchable">
            <div class="title-tabs">
                <van-tabs
                    :active="myFilter.value"
                    type="card"
                    :color="activeColor"
                    style="width: 200px;"
                    @click="handleSwitch">
                    <van-tab name="Extracted_Time$InDate" title="采集时间"/>
                    <van-tab name="User_Last_Process_Time$InDate" title="操作时间"/>
                </van-tabs>
            </div>
            <div
                v-if="isShowSelfDefineTitle"
                style="text-align: center;"
                class="van-ellipsis">{{myQuery[myFilter.value]}}</div>
        </div>
    </base-date-picker-filter>
</template>

<script>
    import Vue from 'vue'
    import QueryFilterMixin from './QueryFilterMixin'
    import BaseDatePickerFilter from './BaseDatePickerFilter'

    import {
        Tab,
        Tabs,
    } from 'vant'

    Vue.use(Tabs)
        .use(Tab)

    export default {
        name: "SwitchableDatePickerFilter",

        mixins: [QueryFilterMixin],

        components: {
            BaseDatePickerFilter,
        },

        data() {
            return {}
        },

        computed: {},

        watch: {},

        created() {
        },

        mounted() {
        },

        destroyed() {
        },

        methods: {
            handleSwitch(name) {
                if (name === 'User_Last_Process_Time$InDate') {
                    this.myQuery[name] = this.query['Extracted_Time$InDate']
                    this.query['Extracted_Time$InDate'] = ''
                } else {
                    this.myQuery[name] = this.query['User_Last_Process_Time$InDate']
                    this.query['User_Last_Process_Time$InDate'] = ''
                }
                console.log(this.myQuery)
            }

        }
    }
</script>

<style lang="less">
    .switchable{
        display: flex;
        flex-direction: column;
        padding: 0  0 10px 0!important;
    }
</style>
