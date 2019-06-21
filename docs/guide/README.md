当前无法判断您的平台，可以手工选择

- [我使用安卓手机](/android/)
- [我使用苹果手机](/ios/)
- [直接打开](https://mymonitor.xyz/kwm-mobile/)
- [访问 PC 网页版](https://mymonitor.xyz/kwm/)


<script>
    export default {
        mounted() {
            // 判断是什么平台
            let u = navigator.userAgent;
            let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1  //android终端
            let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)              //ios终端

            if (isiOS) {
                this.$router.push('/ios/')
            } else if (isAndroid) {
                this.$router.push('/android/')
            } else {
                // PC or Other
            }
        },
    }
</script>
