/**
 * Created by OXOYO on 2017/7/14.
 */

// 导入api
import Api from '../api'

export default {
  'list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getApplicationList(payload)
    return res
  },
  'edit': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doEditApp(payload)
    return res
  },
  'add': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doAddApp(payload)
    return res
  },
  'update': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doUpdateApp(payload)
    return res
  },
  'remove': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doRemoveApp(payload)
    return res
  }
}
