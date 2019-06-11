<template>
    <div class="ksm-login">
        <div class="login-header">
            <div class="logo">
                <img src="../assets/logo.png" alt="">
            </div>
            <div class="system-title">
                <h3>舆情云</h3>
            </div>
        </div>
        <div class="login-body">
            <van-cell-group @keypress.enter="onLoginClick">
                <van-field
                    v-model="username"
                    left-icon="contact"
                    placeholder="账号"
                    required
                    clearable
                />

                <van-field
                    v-model="password"
                    type="password"
                    left-icon="lock"
                    placeholder="密码"
                    required
                    clearable
                />
            </van-cell-group>
            <van-button
                class="submit"
                :block="true"
                :loading="loading"
                @click="onLoginClick"
                loading-type="spinner"
                :loading-text="loadingText"
                type="info">登录
            </van-button>
        </div>
        <div class="login-footer">&copy; {{year}}</div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import LocalStore from '../plugin/local-store/'
    import {isTokenValid} from '../util'
    import {Row, Col, Field, CellGroup, Button, Notify} from 'vant'

    Vue.use(Row)
        .use(Col)
        .use(Field)
        .use(CellGroup)
        .use(Button)

    export default {
        name: "Login",
        props: {},
        data() {
            let date = new Date()
            return {
                loading: false,
                loadingText: '',
                username: '',
                password: '',
                year: date.getFullYear()
            }
        },
        methods: {
            onLoginClick() {
                let data = {
                    grant_type: 'password',
                    client_id: '',
                    client_secret: '',
                    scope: '',
                    username: this.username,
                    password: this.password,
                }

                this.loadingText = '获取令牌...'
                this.loading = true
                this.$api.public.login(data).then(resp => {
                    this.loadingText = '成功获取令牌...'
                    let oauth = resp.data
                    // 存储 Token 信息
                    this.$localStore.setItem(this.$localStore.keys.OAUTH_KEY, oauth)
                    // 设置 axios 请求头
                    this.$api.setAuthorization(oauth)

                    // 获取其他信息；用户信息，权限信息
                    this.loadingText = '获取用户信息...'
                    Promise.all([
                        this.$api.system.userInfo(),
                        // this.$api.system.privileges(),
                    ]).then(responses => {
                        this.$localStore.setItem(this.$localStore.keys.USER_KEY, responses[0].data)
                        // this.$localStore.setItem(this.$localStore.Keys.PRIVILEGE_KEY, responses[1].data)
                        // 跳转
                        this.loadingText = '成功获取用户信息...'
                        this.$router.replace('/')
                        this.loading = false
                    })
                }).catch(err => {
                    this.loading = false
                    Notify('账号或者密码错误！')
                })
            }
        },
        beforeRouteEnter(to, from, next) {
            const token = LocalStore.store.getItem(LocalStore.keys.OAUTH_KEY)
            const isValid = isTokenValid(token)
            console.log('Login beforeRouteEnter() Token is valid', isTokenValid(token))

            if (isValid) {
                // 如果用户已经登录了，直接进入主页
                next('/')
            } else {
                next()
            }
        }
    }
</script>

<style lang="less">
    .ksm-login {
        box-sizing: border-box;
        padding: 16px;
        height: 100vh;
        display: flex;
        flex-direction: column;

        & .login-header {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            & .logo {
                text-align: center;

                & img {
                    width: 50%;
                }
            }
        }

        & .login-body {
            flex: 1;

            & .submit {
                margin-top: 16px;
            }
        }

        & .login-footer {
            flex: 1;
            text-align: center;
            color: #ccc;
        }
    }
</style>