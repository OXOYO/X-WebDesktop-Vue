/**
 * Created by OXOYO on 2017/12/24.
 *
 */

import Vue from 'vue'

export default {
  doInstall: async (data) => {
    let res = await Vue.prototype.$http.post('/Platform/user/application/install', data)
    return res
  }
}
