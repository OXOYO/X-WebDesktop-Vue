/**
 * Created by OXOYO on 2018/4/20.
 */

import Vue from 'vue'

export default {
  // 获取应用列表
  getApplicationList: async (data) => {
    let res = await Vue.prototype.$http.get('/ApplicationMarket/application/list', {
      params: data
    })
    return res
  }
}
