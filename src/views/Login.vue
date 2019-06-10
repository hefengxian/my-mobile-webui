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
            <van-cell-group>
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
                />
            </van-cell-group>
            <van-button
                    class="submit"
                    :block="true"
                    @click="onLoginClick"
                    type="info">登录</van-button>
        </div>
        <div class="login-footer">&copy; {{year}}</div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Row, Col, Field, CellGroup, Button} from 'vant'

    Vue.use(Row).use(Col).use(Field).use(CellGroup).use(Button)

    export default {
        name: "Login",
        props: {},
        data() {
            let date = new Date()

            return {
                username: '',
                password: '',
                year: date.getFullYear()
            }
        },
        methods: {
            onLoginClick() {
                this.$router.push('/')
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