<template>
    <div class="ksm-alert">
        <!-- 顶部栏 -->
        <van-nav-bar
            class="ksm-nav"
            title="发送预警"
            left-text="取消"
            left-arrow
            :fixed="true"
            @click-left="$router.back()"
        >
            <div
                class="nav-actions right"
                slot="right">
                <van-button
                    square
                    class="nav-action"
                    size="small"
                    icon="share"
                    @click="() => {}"/>
                <van-button
                    square
                    class="nav-action"
                    size="small"
                    icon="envelop-o"
                    @click="() => {}"/>
            </div>
        </van-nav-bar>

        <div class="main-container">
            <van-cell-group>
                <van-cell
                    icon="bell"
                    title="预警类型"
                    clickable
                    is-link
                    :value="alertType.selectedName"
                    @click="alertType.show = true"/>
                <!--<van-cell
                    icon="friends-o"
                    title="接收人"
                    is-link
                    clickable
                    @click="selectContact">
                    <div slot="label">
                        管理员 01
                        <br>
                        管理员 02
                    </div>
                </van-cell>-->
                <van-collapse
                    v-model="targetCollapse"
                    :border="false"
                    accordion>
                    <van-collapse-item
                        title="接收人"
                        center
                        class="van-hairline--surround"
                        icon="friends-o"
                        name="1">
                        <div class="">
                            <van-cell-group
                                :border="false">
                                <van-cell
                                    v-for="(item, key) in addressBook"
                                    class="meta-item"
                                    :key="key"
                                    :title="item.Mobile_No"
                                    :value="item.User_Name"
                                    center
                                />
                            </van-cell-group>
                        </div>
                    </van-collapse-item>
                </van-collapse>

                <van-cell
                    icon="records"
                    title="消息模板"
                    clickable
                    is-link
                    value="通用" />
            </van-cell-group>

            <div class="block-title">内容预览</div>
            <div>
                <van-field
                    slot="label"
                    v-model="article.Article_Title"
                    type="textarea"
                    rows="10"/>
            </div>
        </div>

        <van-action-sheet
            v-model="alertType.show"
            :actions="alertType.actions"
            @select="onAlertTypeSelect"
        />
    </div>
</template>

<script>
    import Vue from 'vue'
    import ContactSelector from '../components/ContactSelector/'
    import {
        NavBar,
        Button,
        CellGroup,
        Cell,
        Field,
        ActionSheet,
        Collapse,
        CollapseItem,
    } from 'vant'

    Vue.use(NavBar)
        .use(Button)
        .use(CellGroup)
        .use(Cell)
        .use(Field)
        .use(ActionSheet)

    export default {
        name: "Alert",

        mixins: [],

        components: {},

        props: {},

        data() {
            let ls = this.$localStore
            let addressBook = ls.getItem(ls.keys.ADDRESS_BOOK)
            addressBook = addressBook.map(addr => {
                addr._checked = false
                return addr
            })

            return {
                article: this.$route.params,
                addressBook,
                contentTemplate: '',
                alertType: {
                    show: false,
                    actions: [
                        {name: '微信', code: 'W'},
                        {name: '短信', code: 'S'},
                        {name: '邮件', code: 'E'},
                    ],
                    selectedName: '微信',
                },
                params: {
                    type: 'W',
                    target: [],
                },


                targetCollapse: false,
            }
        },

        computed: {

        },

        watch: {},

        created() {
        },

        mounted() {
            console.log(this.addressBook)
        },

        destroyed() {
        },

        methods: {
            onAlertTypeSelect(item) {
                this.alertType.show = false
                this.params.type = item.code
                this.alertType.selectedName = item.name
            },

            selectContact() {
                ContactSelector.show(this.addressBook, this.params.type)
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.article = to.params
            })
        }
    }
</script>

<style>

</style>
