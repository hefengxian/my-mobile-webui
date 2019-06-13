<template>
    <van-tag
        :type="emotion.type"
        mark>{{emotion.text}}</van-tag>
</template>

<script>
    import Vue from 'vue'
    import {Tag} from 'vant'

    Vue.use(Tag)

    export default {
        name: "Emotion",
        mixins: [],
        components: {},
        props: {
            article: {
                type: Object
            }
        },
        data() {
            return {}
        },
        computed: {
            emotion() {
                let isConfirm = this.article['User_Process_Status'] === 'S'
                let emotion = this.article[isConfirm ? 'User_Confirm_Emotion_Type' : 'Auto_Emotion_Type']

                let text = '中性'
                let type = 'default'
                switch (emotion) {
                    case 0:
                        text = '中性'
                        type = isConfirm ? 'primary' : 'default'
                        break;
                    case -1:
                        text = '负面'
                        type = isConfirm ? 'danger' : 'default'
                        break;
                    case 1:
                        text = '正面'
                        type = isConfirm ? 'success' : 'default'
                        break;
                }
                return {text, type}
            }
        },
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
