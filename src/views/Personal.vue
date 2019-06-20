<template>
    <div class="ksm-personal">
        <van-nav-bar
            style="height: 50px; line-height: 50px;"
            title="个人中心"
            :fixed="true"
        >
        </van-nav-bar>

        <div class="main-container">
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
                        <van-icon name="add-o" />
                    </div>
                </van-cell>
            </van-cell-group>

            <van-cell-group style="margin-top: 16px;">
                <van-cell
                    clickable
                    title-style="text-align: center; color: red"
                    @click="logout"
                    title="退出"/>
            </van-cell-group>
        </div>
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
        // SwipeCell,
        Button,
    } from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Skeleton)
        .use(Cell)
        .use(CellGroup)
        // .use(SwipeCell)
        .use(Button)

    export default {
        name: "Personal",
        mixins: [CommonMixin],
        data() {
            let u = this.$localStore.getItem(this.$localStore.keys.USER_KEY)
            return {
                activeColor: '#1989fa',
                u,
                storedAccounts: {},
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
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
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
