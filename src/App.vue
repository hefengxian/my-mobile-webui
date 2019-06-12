<template>
    <div id="app" ontouchstart="" onmouseover="">
        <FullScreenLoading v-show="getLoading"/>
        <router-view v-show="!getLoading"/>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import FullScreenLoading from "./components/FullScreenLoading";
    import {isTokenValid} from './util'

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

            // 如果已经登录设置 Authorization 请求头到 Axios
            let token = this.$localStore.getItem(this.$localStore.keys.OAUTH_KEY)
            if (isTokenValid(token)) {
                this.$api.setAuthorization(token)
            }
        },

        mounted() {
        },

        destroyed() {
        },

        methods: {
        },

    };
</script>

<style lang="less">
    html {
        background: #f5f5f5;
        font-family: inherit!important;
    }
    #app {
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
</style>
