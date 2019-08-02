<template>
    <van-popup
        v-model="show"
        class="ksm-query-filter"
        position="top">
        <div class="query-filter-wrap">
            <van-search
                v-model="query.Keyword"
                type="text"
                placeholder="请输入搜索关键词"/>
            <div class="query-filters">
                <template v-for="filter in filters">
                    <component
                        :filter="filter"
                        :query="query"
                        :is="getComponent(filter)"
                        @change="handleFilterChange"/>
                </template>
            </div>
        </div>
        <div style="position: absolute; bottom: 0; width: 100%; display: flex; z-index: 5">
            <van-button
                style="flex: 1"
                square
                block
                type="default"
                @click="resetFilter">重置
            </van-button>
            <van-button
                style="flex: 1"
                square
                block
                type="info"
                @click="handleSubmit"
            >确定
            </van-button>
        </div>
    </van-popup>
</template>

<script>
    import Vue from 'vue'
    import {isDateRangeValid} from "../../util/assist"
    import DateRangePicker from '../DateRangePicker'
    import BaseFilter from './BaseFilter'
    import BaseDatePickerFilter from './BaseDatePickerFilter'
    import SwitchableDatePickerFilter from './SwitchableDatePickerFilter'

    import {
        NavBar,
        Cell,
        CellGroup,
        Icon,
        Tag,
        Checkbox,
        Pagination,
        Popup,
        Tab,
        Tabs,
        Collapse,
        CollapseItem,
        Row,
        Col,
        Search,
        Button,
        DatetimePicker,
        Dialog,
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Cell)
        .use(CellGroup)
        .use(Tag)
        .use(Checkbox)
        .use(Pagination)
        .use(Popup)
        .use(Tab)
        .use(Tabs)
        .use(Collapse)
        .use(CollapseItem)
        .use(Row)
        .use(Col)
        .use(Search)
        .use(Button)
        .use(DatetimePicker)
        .use(Dialog)

    export default {
        name: "QueryFilter",

        mixins: [],

        components: {
            DateRangePicker,
            BaseFilter,
            BaseDatePickerFilter,
            SwitchableDatePickerFilter,
        },

        props: {
            value: {
                type: Boolean,
                default: false
            },
            query: {
                type: Object,
                default() {
                    return {}
                }
            },
            tagGroups: {
                type: Array,
                default() {
                    return []
                }
            }
        },

        data() {
            return {
                activeColor: '#1989fa',
                show: this.value,
            }
        },

        computed: {
            isSelectedQuery() {
                return this.query.User_Process_Status$$ === 'S'
            },
            filters() {
                let tags = [
                    {label: '所有', value: ''},
                ]
                this.tagGroups.forEach(v => {
                    v.tags.forEach(t => {
                        tags.push({label: t.Tag, value: t.Tag_ID})
                    })
                })

                let normalFilters = [
                    {
                        type: 'datePicker',
                        datePicker: {
                            show: false,
                            value: '',
                            isSelect: isDateRangeValid, // 如果时间格式满足指定的时间范围格式就代表当前选择了自定义时间
                        },
                        title: '采集时间',          // 筛选项的标题
                        value: 'Extracted_Time$InDate',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '最近 3 小时', value: 'pasthours_3'},
                            {label: '最近 18 小时', value: 'pasthours_18'},
                            {label: '今天', value: 'today'},
                            {label: '昨天', value: 'yesterday'},
                            {label: '最近 3 天', value: 'pastdays_3'},
                            {label: '最近 7 天', value: 'pastdays_7'},
                            {label: '本周', value: 'thisweek'},
                            {label: '本月', value: 'thismonth'},
                        ],           // 选项，数组
                    },
                    {
                        type: 'datePicker',
                        datePicker: {
                            show: false,
                            value: '',
                            isSelect: isDateRangeValid, // 如果时间格式满足指定的时间范围格式就代表当前选择了自定义时间
                        },
                        title: '发布时间',          // 筛选项的标题
                        value: 'Article_PubTime$InDate',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '最近 3 小时', value: 'pasthours_3'},
                            {label: '最近 18 小时', value: 'pasthours_18'},
                            {label: '今天', value: 'today'},
                            {label: '昨天', value: 'yesterday'},
                            {label: '最近 3 天', value: 'pastdays_3'},
                            {label: '最近 7 天', value: 'pastdays_7'},
                            {label: '本周', value: 'thisweek'},
                            {label: '本月', value: 'thismonth'},
                            {label: '空', value: 'NULL'},
                        ],           // 选项，数组
                    },
                    {
                        title: '文章状态',          // 筛选项的标题
                        value: 'User_Process_Status$$',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '未读', value: 'N'},
                            {label: '已读', value: 'U'},
                            // {label: '已选', value: 'S'},
                        ],           // 选项，数组
                    },
                    {
                        title: '情感属性',          // 筛选项的标题
                        value: 'Emotion_Type$$',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '疑似负面', value: '3'},
                            {label: '中性', value: '2'},
                            {label: '疑似正面', value: '1'},
                            // {label: '确认负面', value: '6'},
                            // {label: '确认正面', value: '4'},
                        ],           // 选项，数组
                    },
                    {
                        title: '排序',          // 筛选项的标题
                        value: 'Order_By',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {
                                label: '相关度',
                                value: 'Total_Score$DESC'
                            },
                            {
                                label: '采集时间',
                                value: 'Article_Extracted_Time$DESC'
                            },
                            {
                                label: '发布时间',
                                value: 'Article_PubTime$DESC'
                            },
                        ],           // 选项，数组
                    },
                ]
                let selectedFilters = [
                    {
                        type: 'datePicker',
                        datePicker: {
                            show: false,
                            value: '',
                            isSelect: isDateRangeValid, // 如果时间格式满足指定的时间范围格式就代表当前选择了自定义时间
                        },
                        title: '操作时间',          // 筛选项的标题
                        value: 'User_Last_Process_Time$InDate',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '最近 3 小时', value: 'pasthours_3'},
                            {label: '最近 18 小时', value: 'pasthours_18'},
                            {label: '今天', value: 'today'},
                            {label: '昨天', value: 'yesterday'},
                            {label: '最近 3 天', value: 'pastdays_3'},
                            {label: '最近 7 天', value: 'pastdays_7'},
                            {label: '本周', value: 'thisweek'},
                            {label: '本月', value: 'thismonth'},
                        ],           // 选项，数组
                    },
                    {
                        type: 'datePicker',
                        datePicker: {
                            show: false,
                            value: '',
                            isSelect: isDateRangeValid, // 如果时间格式满足指定的时间范围格式就代表当前选择了自定义时间
                        },
                        title: '采集时间',          // 筛选项的标题
                        value: 'Extracted_Time$InDate',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '最近 3 小时', value: 'pasthours_3'},
                            {label: '最近 18 小时', value: 'pasthours_18'},
                            {label: '今天', value: 'today'},
                            {label: '昨天', value: 'yesterday'},
                            {label: '最近 3 天', value: 'pastdays_3'},
                            {label: '最近 7 天', value: 'pastdays_7'},
                            {label: '本周', value: 'thisweek'},
                            {label: '本月', value: 'thismonth'},
                        ],           // 选项，数组
                    },
                    {
                        type: 'datePicker',
                        datePicker: {
                            show: false,
                            value: '',
                            isSelect: isDateRangeValid, // 如果时间格式满足指定的时间范围格式就代表当前选择了自定义时间
                        },
                        title: '发布时间',          // 筛选项的标题
                        value: 'Article_PubTime$InDate',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '最近 3 小时', value: 'pasthours_3'},
                            {label: '最近 18 小时', value: 'pasthours_18'},
                            {label: '今天', value: 'today'},
                            {label: '昨天', value: 'yesterday'},
                            {label: '最近 3 天', value: 'pastdays_3'},
                            {label: '最近 7 天', value: 'pastdays_7'},
                            {label: '本周', value: 'thisweek'},
                            {label: '本月', value: 'thismonth'},
                            {label: '空', value: 'NULL'},
                        ],           // 选项，数组
                    },
                    {
                        title: '处理结果',          // 筛选项的标题
                        value: 'Followup_Status$$',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '已处理', value: 'Y'},
                            {label: '未处理', value: 'N'},
                        ],           // 选项，数组
                    },
                    {
                        title: '情感属性',          // 筛选项的标题
                        value: 'Emotion_Type$$',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {label: '所有', value: ''},
                            {label: '确认负面', value: '6'},
                            {label: '确认中性', value: '5'},
                            {label: '确认正面', value: '4'},
                        ],           // 选项，数组
                    },
                    {
                        title: '排序',          // 筛选项的标题
                        value: 'Order_By',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: [
                            {
                                label: '选择时间',
                                value: 'User_Last_Process_Time$DESC'
                            },
                            {
                                label: '相关度',
                                value: 'Total_Score$DESC'
                            },
                            {
                                label: '采集时间',
                                value: 'Article_Extracted_Time$DESC'
                            },
                            {
                                label: '发布时间',
                                value: 'Article_PubTime$DESC'
                            },
                        ],           // 选项，数组
                    },
                    {
                        title: '标签',          // 筛选项的标题
                        value: 'Tag_ID',          // 默认值，单选的时候是字符串或者数字，多选的时候是数组
                        data: tags,           // 选项，数组
                    },
                ]
                return this.isSelectedQuery ? selectedFilters : normalFilters
            },
        },

        watch: {
            value(val) {
                this.show = val
            },
            show(val) {
                this.$emit('input', val)
            }
        },

        created() {
        },

        mounted() {
        },

        destroyed() {
        },

        methods: {
            resetFilter() {
                if (this.isSelectedQuery) {
                    [
                        'Extracted_Time$InDate',
                        // 'User_Last_Process_Time$InDate',
                        'Article_PubTime$InDate',
                        'Followup_Status$$',
                        'Tag_ID',
                        'Emotion_Type$$',
                        // 'Order_By',
                    ].forEach(v => this.query[v] = '')
                    this.query.User_Last_Process_Time$InDate = 'today'
                    this.query.Order_By = 'User_Last_Process_Time$DESC'
                } else {
                    [
                        // 'Extracted_Time$InDate',
                        'User_Last_Process_Time$InDate',
                        'Article_PubTime$InDate',
                        'Followup_Status$$',
                        'Tag_ID',
                        'Emotion_Type$$',
                        'User_Process_Status$$',
                        // 'Order_By',
                    ].forEach(v => this.query[v] = '')
                    this.query.Extracted_Time$InDate = 'today'
                    this.query.Order_By = 'Total_Score$DESC'
                }
            },
            getComponent(filter) {
                let component = BaseFilter
                switch (filter.type) {
                    case 'datePicker':
                        component = BaseDatePickerFilter
                        break
                    case 'switchableDatePickerFilter':
                        component = SwitchableDatePickerFilter
                        break
                    default:
                        break
                }
                return component
            },

            handleFilterChange(query) {
                this.query = query
            },

            handleSubmit() {
                this.show = false
                this.$emit('change', this.query)
            }
        }
    }
</script>

<style lang="less">
    .ksm-query-filter {
        height: 80%;
        width: 100%;
        background-color: #fff;

        & .query-filter-wrap {
            position: relative;
            height: 100%;
            overflow-y: auto;
        }

        & .query-filters {
            padding: 0 16px;
            margin-bottom: 50px;

            & .filter-item {
                margin-bottom: 16px;
            }
        }

        & .block-title {
            display: flex;
            padding-left: 0;
            padding-top: 0;

            & .title-tabs {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;

                & .van-tabs--card {
                    padding-top: 0;
                }

                // 标题里的 Tabs 样式
                & .van-tabs__nav--card {
                    height: auto;
                    margin: auto;
                }

                & .van-tab {
                    font-size: 12px;
                    line-height: 20px;
                    height: 20px;
                }
            }

            & .label {
                flex: 1;
                padding-right: 8px;
            }
        }
    }


</style>
