/**
 * Created by OXOYO on 2017/7/14.
 */

import Vue from 'vue'

export default {
  // 获取账号列表
  getApplicationList: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.get(
      Vue.prototype.$utils.Serv.handleUrl('/MyApplication/list'),
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
      Vue.prototype.$utils.Serv.handleUrl('/MyApplication/edit'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 添加应用
  doAddApp: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/MyApplication/add'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 更新应用
  doUpdateApp: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/MyApplication/update'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  doRemoveApp: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/MyApplication/remove'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  }
}
