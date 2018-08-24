/**
 * Created by OXOYO on 2017/12/24.
 *
 * 接口
 */

import Vue from 'vue'

export default {
  doSendMessage: async (data) => {
    let res = await Vue.prototype.$http.post('/iChat/sendMessage', data)
    return res
  }
}
