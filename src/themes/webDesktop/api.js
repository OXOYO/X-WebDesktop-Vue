/**
 * Created by OXOYO on 2017/7/19.
 */

import Vue from 'vue'

export default {
  // 更新用户应用pinned状态
  doAppPinnedUpdate: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/WebDesktop/application/pinned/update'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 获取用户应用列表
  getApplicationListByUserId: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.get(
      Vue.prototype.$utils.Serv.handleUrl('/WebDesktop/application/list'),
      {
        params: Vue.prototype.$utils.Serv.handleParams(data)
      }
    )
    Vue.prototype.$Loading.finish()

    return res
  }
}
