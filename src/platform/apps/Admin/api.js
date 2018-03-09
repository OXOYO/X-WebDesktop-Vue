/**
 * Created by OXOYO on 2017/12/24.
 *
 * 接口
 */

import Vue from 'vue'

export default {
  user: {
    // 获取用户基本信息
    getBaseInfo: async (data) => {
      let res = await Vue.prototype.$http.get('/Platform/user/BaseInfo')
      return res
    },
    // 获取用户应用列表
    getApplicationListByUserId: async (data) => {
      let res = await Vue.prototype.$http.get('/Platform/user/application/list')
      return res
    }
  }
}
