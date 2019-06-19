/**
 * Copyright © 2019-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: 𝑭𝒓𝒂𝒏𝒌 2019-06
 * @version 1.0
 */


/**
 * 简单的 JWT Token 过期校验
 *
 * @param {object} token JWT Token 对象
 * @returns {boolean} Token 是否还有效
 */
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


/**
 * 最轻量的千分位数字格式化
 *
 * @param {number} num 要格式化的数字
 * @returns {string} 格式化之后的字符串
 */
export function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


/**
 * DateRange 相关函数
 *
 * 用来确定日期格式是否合法 `2019/05/10 00:00:00 - 2019/05/10 05:59:59`
 *
 * @param {string} val 要确定的字符串
 * @returns {boolean}
 */
export function isDateRangeValid(val) {
    let reg = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2} - \d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/
    return reg.test(val)
}


/**
 * 检查一个对象的某个属性是否为一个非空字符串
 *
 * @param {object} obj
 * @param {string} attr
 * @return {boolean}
 */
export function isValidString(obj, attr) {
    return obj[attr] && typeof obj[attr] === 'string' && obj[attr].trim().length > 0
}
