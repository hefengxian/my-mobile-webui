<template>
    <div class="ksm-date-range-picker van-hairline--surround">
        <!-- 开始时间 -->
        <van-datetime-picker
            v-model="startTime"
            :title="returnValue"
            show-toolbar
            type="datetime"
            :visible-item-count="1"
            :item-height="35"
            @cancel="$emit('cancel')"
            @confirm="confirm"
        />

        <!-- 结束时间 -->
        <van-datetime-picker
            v-model="endTime"
            :min-date="startTime"
            :show-toolbar="false"
            :visible-item-count="1"
            type="datetime"
            :item-height="35"
        />
    </div>
</template>

<script>
    import Vue from 'vue'
    import {DatetimePicker} from 'vant'
    import {isDateRangeValid} from "../util/assist"

    Vue.use(DatetimePicker)

    export default {
        name: "DateRangePicker",
        mixins: [],
        components: {},
        props: {
            value: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                startTime: null,
                endTime: null,
            }
        },
        computed: {
            title() {
                return isDateRangeValid(this.value) ? this.returnValue : ""
            },
            returnValue() {
                // 由于 Vant 的日期选择控件只能精确到分钟，秒部分需要自行处理
                let format = 'YYYY/MM/DD HH:mm'
                // 开始时间的秒数部分总是 00
                let startPart = this.$moment(this.startTime).format(format)
                // 结束时间的秒数部分总是 59
                let endPart = this.$moment(this.endTime).format(format)
                return `${startPart}:00 - ${endPart}:59`
            }
        },

        watch: {
            // 监听 Value 的变化
            value(newVal, oldVal) {
                this.init(newVal)
            },

            // 这里主要是为了让标题栏的数字实时变动，限制结束日期必须大于开始日期，通过设置 min-date 就实现了
            startTime(val) {
                if (val.getTime() > this.endTime.getTime()) {
                    this.endTime = new Date(val.getTime())
                }
            }
        },

        created() {
            // 初始化
            this.init(this.value)
        },
        mounted() {},
        destroyed() {},

        methods: {
            /**
             * 点击确认按钮的时候调用
             */
            confirm() {
                this.$emit('confirm', this.returnValue)
            },

            /**
             * 初始化，将字符串拆解为控件需要值
             *
             * @param {string} value
             */
            init(value) {
                // 判断是否给出有效的时间格式，如果没有给出有效的时间，默认为当天的开始到结束
                if (isDateRangeValid(value)) {
                    let format = 'YYYY/MM/DD HH:mm:ss'
                    let timeStrings = value.split(/\s-\s/)
                    let startTime = timeStrings[0]
                    let endTime = timeStrings[1]
                    this.startTime = this.$moment(startTime, format).toDate()
                    this.endTime = this.$moment(endTime, format).toDate()
                } else {
                    this.startTime = this.$moment().startOf('day').toDate()
                    this.endTime = this.$moment().endOf('day').toDate()
                }
            },
        }
    }
</script>

<style lang="less">
    .ksm-date-range-picker {
        .van-picker__title {
            flex: 1;
            font-size: 12px;
            max-width: inherit;
        }
    }
</style>