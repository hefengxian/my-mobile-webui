<template>
    <div id="app" ontouchstart="" onmouseover="">
        <!--<FullScreenLoading v-show="getLoading"/>-->
        <keep-alive>
            <router-view v-show="!getLoading"/>
        </keep-alive>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Axios from 'axios'
    import {mapGetters} from "vuex"
    // import FullScreenLoading from "./components/FullScreenLoading"
    import {isTokenValid, isValidString} from './util/assist'
    import {Dialog} from 'vant'

    Vue.use(Dialog)

    // 字符画 LOGO
    const logo = `
   __ __                __                   ____
  / //_/__  ___ _    __/ /__ ___ __ _____   /  _/__  ____
 / ,< / _ \\/ _ \\ |/|/ / / -_|_-</ // (_-<  _/ // _ \\/ __/
/_/|_/_//_/\\___/__,__/_/\\__/___/\\_, /___/ /___/_//_/\\__(_)
Powered by Knowlesys Inc.      /___/`


    export default {
        name: "App",

        mixins: [],

        components: {
            // FullScreenLoading
        },

        props: {},

        data() {
            return {
                loading: true,

                // SW 更新相关
                refreshing: false,
                registration: null,
                updateExists: false,
            };
        },

        computed: {
            ...mapGetters([
                'getLoading'
            ]),
        },

        watch: {},

        created() {
            // 打印字符画
            console.log(logo)

            let ls = this.$localStore
            let api = this.$api

            // 如果已经登录设置 Authorization 请求头到 Axios
            let token = ls.getItem(ls.keys.OAUTH_KEY)
            if (isTokenValid(token)) {
                this.$api.setAuthorization(token)
            }

            // SW 更新相关
            document.addEventListener('swUpdated', this.showRefresh, {once: true})
            if (navigator.serviceWorker) {
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload()
                })
            }

            // axios 拦截器
            Axios.interceptors.response.use(response => {
                // Do something
                return response
            }, error => {
                if (!error.response) {
                    return Promise.reject(error)
                }
                if (error.response.status === 401) {    // Token 被拒绝
                    let token = ls.getItem(ls.keys.OAUTH_KEY)
                    if (isValidString(token, 'refresh_token')) {
                        // 存在 Refresh Token 尝试进行刷新操作

                        // 组装参数
                        let params = {
                            grant_type: 'refresh_token',
                            refresh_token: token.refresh_token,
                            client_id: '',
                            client_secret: '',
                            scope: '',
                        }

                        return api.login(params).then(resp => {
                            // 刷新 Token 成功
                            let newToken = resp.data
                            // 将新 Token 存起来，并将 Axios 的请求头更新
                            ls.setItem(ls.keys.OAUTH_KEY, newToken)
                            api.setAuthorization(newToken)

                            // 将当前被拒绝的请求再次发送
                            let config = error.config
                            // 为这个请求更新认证请求头
                            config.headers.Authorization = `${newToken.token_type} ${newToken.access_token}`
                            return Axios.request(config)

                        }).catch(err => {
                            // 刷新失败，可能连 Refresh Token 都失效了，清理现有认证数据，跳转到登录页
                            ls.logout()
                            this.$router.push({name: 'Login'})
                        })
                    }
                }
                return Promise.reject(error)
            })
        },

        mounted() {
        },

        destroyed() {
        },

        methods: {
            showRefresh(e) {
                let registration = e.detail
                Dialog.alert({message: '新版发布了', confirmButtonText: '更新'}).then(() => {
                    // 点击按钮之后，调用 SW 相关逻辑
                    // Protect against missing registration.waiting.
                    if (!registration || !registration.waiting) {
                        return
                    }
                    registration.waiting.postMessage('skipWaiting')
                })
            },


        },

    };
</script>

<style lang="less">
    html {
        background: #f5f5f5;
        //font-family: inherit!important;
    }
    #app {
        .keyword {
            &-focus {
                color: #00a854 !important;
            }
            &-black-list {
                text-decoration: line-through;
                color: #E67E22 !important;
            }
            &-exclude {
                text-decoration: line-through;
                color: #BDC3C7 !important;
            }
            &-negative {
                color: #f04134 !important;
            }
            &-positive {
                color: #146C8C !important;
            }
            &-extract-search {
                color: #8E44AD !important;
            }
            &-search {
                padding: .2em;
                background-color: #f89633 !important;
                border-radius: 4px;
                color: #fff !important;
            }
        }

        .total-count {
            padding: 8px 0;
            display: block;
            color: #AAA;
            font-size: 12px;
            text-align: center;
        }
    }


    .kwm-active {
        background-color: #e6e6e6!important;
        position: relative;
        z-index: 2;
    }
    .main-container {
        margin: 50px 0;
        // padding: 8px 0;

        & .skeleton-wrapper {
            margin-top: 16px;
            background-color: #fff;
            padding: 8px;
            &:first-child {
                margin-top: 0;
            }
        }
    }

    .ksm-nav {
        height: 50px!important;
        line-height: 50px!important;

        & .van-nav-bar__right {
            right: 8px;
        }
        & .van-nav-bar__left {
            left: 8px;
        }

        & .nav-actions {
            display: flex;
            height: 50px;
            align-items: center;

            &.left .nav-action:first-child {
                // margin-left: -12px;
            }

            &.right .nav-action:last-child {
                // margin-right: -12px;
            }

            & .nav-action {
                min-width: 40px;
                font-size: 16px;
                border: none;
            }
        }
    }
</style>
