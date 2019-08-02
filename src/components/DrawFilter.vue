<template>
    <van-popup
        v-model="show"
        style="height: 100%; width: 75%; background-color: #fff;"
        position="left">
        <div>
            <van-cell-group>
                <van-cell
                    center
                    :title="u.User_Name"
                    :label="`${u.Client_Name} - ${u.Role_Name}`">
                    <img
                        slot="icon"
                        :src="`img/avatars/${getAvatarURI(u)}`"
                        style="width: 40px; height: 40px; border-radius: 20px; margin-right: 16px;"
                        alt="">
                </van-cell>
            </van-cell-group>

            <!-- 分类 -->
            <template
                v-for="type of mySubjectCategories"
                v-if="type.data.length > 0">
                <div class="block-title">{{type.label}}</div>
                <van-collapse
                    class="list-menu"
                    v-model="subjectActiveName"
                    :border="false"
                    accordion>

                    <van-cell
                        icon="award-o"
                        clickable
                        class="list-item-all"
                        :border="true"
                        @click="handleQueryParamChange('Subject_ID$In', type.all)"
                        title="所有">
                        <van-icon
                            v-if="myQuery.Subject_ID$In === type.all"
                            :color="activeColor"
                            name="checked"
                        />
                    </van-cell>

                    <van-collapse-item
                        v-for="category in type.data"
                        icon="send-gift-o"
                        :key="category.Subject_Category_Name"
                        :title="category.Subject_Category_Name"
                        :name="category.Subject_Category_ID">
                        <van-cell
                            class="list-item-all"
                            @click="handleQueryParamChange('Subject_ID$In', subject.Subject_ID)"
                            v-for="subject in category.subjects"
                            :icon="subject.icon ? subject.icon : 'debit-pay'"
                            :key="subject.Subject_ID"
                            clickable
                            :title="subject.Subject_Name">
                            <van-icon
                                v-if="myQuery.Subject_ID$In === subject.Subject_ID"
                                :color="activeColor"
                                name="checked"
                            />
                        </van-cell>
                    </van-collapse-item>
                </van-collapse>
            </template>


            <!-- 媒体类型 -->
            <div class="block-title">媒体类型</div>
            <van-collapse
                v-model="mediaActiveName"
                class="list-menu"
                accordion>
                <van-cell
                    icon="award-o"
                    clickable
                    class="list-item-all"
                    :border="true"
                    @click="handleQueryParamChange('Media_Type_Code$In')"
                    title="所有">
                    <van-icon
                        v-if="myQuery.Media_Type_Code$In === ''"
                        :color="activeColor"
                        name="checked"
                    />
                </van-cell>

                <van-collapse-item
                    v-for="group in myMediaTypeGroups"
                    :title="group.label"
                    :key="group.value"
                    icon="pending-payment"
                    :name="group.value">

                    <van-cell
                        v-for="media in group.children"
                        @click="handleQueryParamChange('Media_Type_Code$In', media.Media_Type_Code)"
                        clickable
                        :key="media.Media_Type_Code"
                        :icon="media.icon ? media.icon : 'debit-pay'"
                        :border="true"
                        :title="media.Media_Type_Name">
                        <van-icon
                            v-if="query.Media_Type_Code$In === media.Media_Type_Code"
                            :color="activeColor"
                            name="checked"
                        />
                    </van-cell>
                </van-collapse-item>
            </van-collapse>
            <!-- /媒体类型 -->
        </div>
    </van-popup>
</template>

<script>
    import Vue from 'vue'
    import CommonMixin from '../util/CommonMixin'
    import {
        Collapse,
        CollapseItem,
        Popup,
        Cell,
        Icon,
        CellGroup,
    } from 'vant'

    Vue.use(Collapse)
        .use(CollapseItem)
        .use(Popup)
        .use(Cell)
        .use(Icon)
        .use(CellGroup)

    export default {
        name: "DrawFilter",

        mixins: [CommonMixin],

        components: {},

        props: {
            value: {
                type: Boolean,
                default: false,
            },
            query: {
                type: Object,
                default() {
                    return {}
                }
            },
            mediaTypeGroups: {
                type: Array,
                default() {
                    return []
                }
            },
            subjectCategories: {
                type: Object,
                default() {
                    return {}
                }
            },
        },

        data() {
            let ls = this.$localStore
            let u = ls.getItem(ls.keys.USER_KEY)
            return {
                u,
                show: this.value,
                subjectActiveName: '',
                mediaActiveName: '',
                myQuery: this.query,
                myMediaTypeGroups: this.mediaTypeGroups,
                mySubjectCategories: this.subjectCategories,
            }
        },

        computed: {},

        watch: {
            value(val) {
                this.show = val
            },
            show(val) {
                this.$emit('input', val)
            },
            query(val) {
                this.myQuery = val
            },
            mediaTypeGroups(val) {
                this.myMediaTypeGroups = val
            },
            subjectCategories(val) {
                this.mySubjectCategories = val
            },
        },

        created() {
        },

        mounted() {
        },

        destroyed() {
        },

        methods: {
            /**
             * 执行查询
             *
             * @param {string} key 哪一个条件，对应 query 对象的键
             * @param {string} value 值
             */
            handleQueryParamChange(key, value = '') {
                this.show = false
                this.myQuery[key] = value
                this.$emit('change', this.myQuery)
            },
        }
    }
</script>

<style>

</style>
