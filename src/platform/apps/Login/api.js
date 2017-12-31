/**
 * Created by OXOYO on 2017/12/24.
 *
 * 接口
 */

import Vue from 'vue'

export default {
// 执行登录
  doSignIn: async (data) => {
    let res = await Vue.prototype.$http.post('/Platform/user/signIn', data)
    return res
  }
}
