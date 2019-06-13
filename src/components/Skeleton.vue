<template>
    <div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
        <div class="skeleton-wrapper">
            <van-skeleton title :row="2"/>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Skeleton} from 'vant'
    Vue.use(Skeleton)

    export default {
        name: "Skeleton",
        mixins: [],
        components: {},
        props: {},
        data() {
            return {}
        },
        computed: {},
        watch: {},
        created() {
        },
        mounted() {
        },
        destroyed() {
        },
        methods: {}
    }
</script>

<style scoped>

</style>
