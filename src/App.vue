<template>
    <div id="app">
        <FullScreenLoading v-if="loading"/>
        <router-view v-if="!loading"/>
    </div>
</template>

<script>
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

        computed: {},

        watch: {},

        created() {

            setTimeout(() => {
                let r = {}
                r.path = Math.round(Math.random() * 2) === 0 ? '/about' : '/home'
                console.log(r, this.$router)
                this.$router.push(r)
                this.loading = false
            }, 5000)
            console.log('App created...')
        },

        mounted() {

            console.log('App mounted...')
        },

        destroyed() {
        },

        methods: {},

    };
</script>

<style lang="less"></style>
