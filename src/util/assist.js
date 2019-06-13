

export function isTokenValid(token) {
    if (token && token.access_token && typeof token.access_token === "string") {
        // 切割 JWT
        let accessToken = token.access_token
        let jwt = accessToken.split(/\./)
        if (jwt.length !== 3) {
            return false
        }
        // 计算过期时间
        let payload = JSON.parse(atob(jwt[1]))
        let now = Date.now()
        let expire = payload.exp * 1000
        return expire > now
    }
    return false
}


export function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
