/**
 * Created by OXOYO on 2017/7/14.
 */

// 导入api
import Api from '../api'

export default {
  // 获取账号列表
  'account/list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getAccountList(payload)
    return res
  },
  // 添加账号
  'account/add': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doAddAccount(payload)
    return res
  },
  // 删除账号
  'account/remove': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doRemoveAccount(payload)
    return res
  },
  // 编辑账号
  'account/edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doEditAccount(payload)
    return res
  },
  // 获取所有的app
  'Apps/all': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getAllApps(payload)
    return res
  }
}
