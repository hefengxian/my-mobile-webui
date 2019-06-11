<template>
    <div id="app">
        <FullScreenLoading v-show="getLoading"/>
        <router-view v-show="!getLoading"/>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import FullScreenLoading from "./components/FullScreenLoading";

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
            FullScreenLoading
        },

        props: {},

        data() {
            return {
                loading: true
            };
        },

        computed: {
            ...mapGetters([
                'getLoading'
            ]),
        },

        watch: {},

        created() {
            console.log(logo)
        },

        mounted() {
        },

        destroyed() {
        },

        methods: {
            isTokenValid(token) {
                if (typeof token === 'object' && typeof token.access_token === "string") {
                    // 切割 JWT
                    let accessToken = token.access_token
                    let jwt = accessToken.split(/\./)
                    if (jwt.length !== 3) {
                        return false
                    }
                    let payload = JSON.parse(atob(jwt[1]))
                    let now = Date.now()
                    let expire = payload.exp * 1000
                    return expire > now
                }
                return false
            }
        },

    };
</script>

<style lang="less">
    #app {
        background-color: #f8f8f8;
        min-height: 100vh;
    }
</style>
