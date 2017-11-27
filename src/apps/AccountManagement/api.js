/**
 * Created by OXOYO on 2017/7/14.
 */

import Vue from 'vue'

export default {
  // 获取账号列表
  getAccountList: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.get(
      Vue.prototype.$utils.Serv.handleUrl('/AccountManagement/account/list'),
      {
        params: Vue.prototype.$utils.Serv.handleParams(data)
      }
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 添加账号
  doAddAccount: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/AccountManagement/account/add'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 删除账号
  doRemoveAccount: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/AccountManagement/account/remove'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 编辑账号
  doEditAccount: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.post(
      Vue.prototype.$utils.Serv.handleUrl('/AccountManagement/account/edit'),
      Vue.prototype.$utils.Serv.handleParams(data)
    )
    Vue.prototype.$Loading.finish()

    return res
  },
  // 获取所有的应用
  getAllApps: async (data) => {
    Vue.prototype.$Loading.start()
    let res = await Vue.prototype.$http.get(
      Vue.prototype.$utils.Serv.handleUrl('/AccountManagement/Apps/all'),
      {
        params: Vue.prototype.$utils.Serv.handleParams(data)
      }
    )
    Vue.prototype.$Loading.finish()

    return res
  }
}
