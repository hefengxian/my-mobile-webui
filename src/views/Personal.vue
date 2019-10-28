<template>
    <div class="main-container ksm-personal">
        <!-- 顶部栏 -->
        <van-nav-bar
            class="ksm-nav"
            title="个人中心"
            :fixed="true"
        />

        <van-cell-group>
            <van-cell
                v-for="account in storedAccounts"
                :key="account.User_ID"
                :title="account.User_Name"
                :label="`${account.Client_Name} - ${account.Role_Name}`"
                clickable
                center
                @click="switchUser(account)">
                <img
                    slot="icon"
                    class="avatar"
                    :src="`img/avatars/${getAvatarURI(account)}`"
                    alt="">
                <van-icon
                    v-if="account.User_ID === u.User_ID"
                    :color="activeColor"
                    slot="right-icon"
                    name="success"/>
            </van-cell>

            <van-cell
                clickable
                center
                :style="{color: activeColor}"
                title="添加账号" @click="addAccount">
                <div
                    slot="icon"
                    class="avatar">
                    <van-icon name="add-o"/>
                </div>
            </van-cell>
        </van-cell-group>

        <van-cell-group
            style="margin-top: 16px;">
            <van-cell
                clickable
                icon="bars"
                :value="`每页 ${pageSize} 篇`"
                title="分页大小"
                @click="showPageSizePicker = true"
            />
            <!--<van-cell
                    is-link
                    icon="setting-o"
                    title="设置"/>-->
        </van-cell-group>

        <van-cell-group
            style="margin-top: 16px;">
            <van-cell
                clickable
                title-style="text-align: center; color: red"
                @click="logout"
                title="退出"/>
        </van-cell-group>

        <van-popup
            v-model="showPageSizePicker"
            position="bottom">
            <van-picker
                show-toolbar
                :columns="pageSizes"
                @cancel="showPageSizePicker = false"
                @confirm="pageSizeChange"
            />
        </van-popup>

        <!-- 底部栏 -->
        <ButtonTabBar/>
    </div>
</template>

<script>
    import Vue from 'vue'
    import CommonMixin from '../util/CommonMixin'

    import {
        NavBar,
        Icon,
        Skeleton,
        Cell,
        CellGroup,
        Button,
        Picker,
        Popup,
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Skeleton)
        .use(Cell)
        .use(CellGroup)
        .use(Button)
        .use(Picker)
        .use(Popup)

    const sizes = [
        10,
        20,
        50,
        100,
        200,
    ]

    export default {
        name: "Personal",
        mixins: [CommonMixin],
        data() {
            let ls = this.$localStore
            let u = ls.getItem(ls.keys.USER_KEY)
            let pageSize = ls.getItem(ls.keys.PAGE_SIZE)
            pageSize = pageSize ? pageSize : 50
            return {
                activeColor: '#1989fa',
                u,
                storedAccounts: {},
                pageSize,
                pageSizes: [
                    {
                        values: sizes,
                        defaultIndex: sizes.indexOf(pageSize)
                    }
                ],
                showPageSizePicker: false,
            }
        },
        mounted() {
        },
        methods: {
            logout() {
                this.$localStore.logout()
                // 移除已经存储的用户
                delete this.storedAccounts[this.u.User_Account]
                this.$localStore.setItem(this.$localStore.keys.STORED_ACCOUNTS, this.storedAccounts)
                this.$router.replace({name: 'Login'})
            },

            addAccount() {
                this.$router.push({name: 'Login', params: {addAccount: true}})
            },

            switchUser(user) {
                let ls = this.$localStore
                let token = user.Token

                // 用户信息换成当前的
                this.u = user
                // 设置 API 的 Token
                this.$api.setAuthorization(token)
                ls.logout()
                ls.setItem(ls.keys.OAUTH_KEY, token)
                ls.setItem(ls.keys.USER_KEY, user)

                this.initTgs(true)
                this.initKeywords(true)

                // 设置其他需要的信息
                Promise.all([
                    this.$api.common.addressBook(),
                ]).then(responses => {
                    let addressBook = responses[0].data
                    ls.setItem(ls.keys.ADDRESS_BOOK, addressBook)
                })
            },

            pageSizeChange(picker, value, index) {
                this.pageSize = picker[0]
                this.$localStore.setItem(this.$localStore.keys.PAGE_SIZE, this.pageSize)
                this.showPageSizePicker = false
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.u = vm.$localStore.getItem(vm.$localStore.keys.USER_KEY)
                vm.storedAccounts = vm.$localStore.getItem(vm.$localStore.keys.STORED_ACCOUNTS) || {}
            })
        }
    }
</script>

<style lang="less">
    .ksm-personal {
        & .avatar {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin-right: 16px;
        }
    }
</style>
