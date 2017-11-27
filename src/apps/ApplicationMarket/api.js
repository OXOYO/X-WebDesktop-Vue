/**
 * Created by OXOYO on 2017/7/14.
 */

import Vue from 'vue'

export default {
  // 获取应用列表
  getApplicationList: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.get(
      Vue.prototype.$utils.Serv.handleUrl('/ApplicationMarket/list'),
      {
        params: Vue.prototype.$utils.Serv.handleParams(data)
      }
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 编辑应用
  doEditApp: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/ApplicationMarket/edit'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 添加应用
  doAddApp: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/ApplicationMarket/add'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 更新应用
  doUpdateApp: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/ApplicationMarket/update'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  doRemoveApp: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/ApplicationMarket/remove'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  doInstallApp: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/ApplicationMarket/install'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  }
}
