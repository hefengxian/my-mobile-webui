<template>
    <div>
        <van-nav-bar
            style="height: 50px; line-height: 50px;"
            title="个人中心"
            :fixed="true"
        >
        </van-nav-bar>

        <div style="margin: 50px 0; padding: 8px 0">
            <!--<div
                v-for="i in 10"
                :key="i"
                style="margin: 8px 0; background-color: #fff; padding: 8px"
            >
                <van-skeleton title :row="2"/>
            </div>-->


            <van-cell-group>
                <van-cell
                    :title="u.User_Name"
                    :label="`${u.Client_Name} - ${u.Role_Name}`"
                    clickable
                    center>
                    <img
                        slot="icon"
                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                        style="width: 40px; height: 40px; border-radius: 20px; margin-right: 16px;"
                        alt="">
                    <van-icon
                        color="#07c160"
                        slot="right-icon"
                        name="success" />
                </van-cell>

                <!--<van-cell
                    :title="u.User_Name"
                    value="内容"/>-->
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
    import {NavBar, Icon, Skeleton, Cell, CellGroup, Image} from 'vant'

    Vue.use(NavBar)
        .use(Icon)
        .use(Skeleton)
        .use(Cell)
        .use(CellGroup)
        .use(Image)

    export default {
        name: "Personal",
        data(){
            let u = this.$localStore.getItem(this.$localStore.keys.USER_KEY)
            return {
                u
            }
        },
        methods: {
            logout() {
                this.$localStore.clear()
                this.$router.replace('/login')
            },
        }
    }
</script>

<style>

</style>