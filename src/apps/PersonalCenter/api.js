/**
 * Created by OXOYO on 2017/10/9.
 */

import Vue from 'vue'

export default {
  // 获取用户基本信息
  getBaseInfo: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.get(
      Vue.prototype.$utils.Serv.handleUrl('/PersonalCenter/BaseInfo'),
      {
        params: Vue.prototype.$utils.Serv.handleParams(data)
      }
    )
    Vue.prototype.$Loading.finish()

    return res
  }
}
