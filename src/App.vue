<template>
    <div id="app">
        <FullScreenLoading v-show="getLoading" />
        <router-view v-show="!getLoading"/>
    </div>
</template>

<script>
    import { mapGetters } from "vuex"
    import FullScreenLoading from "./components/FullScreenLoading";

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

            /*setTimeout(() => {
                // let r = {path: '/about'}
                // r.path = Math.round(Math.random() * 2) === 0 ? '/about' : '/home'
                // console.log(r, this.$router)
            }, 5000)*/
            console.log('App created...')
        },

        mounted() {
            // this.loading = false
            // console.log(this.$store)
            console.log('App mounted...', this.getLoading)
        },

        destroyed() {
        },

        methods: {},

    };
</script>

<style lang="less">
    #app {
        background-color: #f8f8f8;
        min-height: 100vh;
    }
</style>
