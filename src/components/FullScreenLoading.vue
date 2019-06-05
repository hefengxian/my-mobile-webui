<template>
    <div class="full-screen-loading">
        <div>
            <img src="../assets/logo.png" alt="">
        </div>
        <VanLoading size="24px" vertical>加载中...</VanLoading>
    </div>
</template>

<script>
    import {Loading} from "vant"

    export default {
        name: "FullScreenLoading",
        components: {
            VanLoading: Loading
        }
    }
</script>

<style lang="less">
    .full-screen-loading {
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>