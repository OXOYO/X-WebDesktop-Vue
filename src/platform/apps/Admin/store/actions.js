/**
 * Created by OXOYO on 2017/12/5.
 */

import Api from '../api'

export default {
  // 获取bing壁纸
  'user/BaseInfo': async ({ commit }, payload) => {
    let res = await Api.user.getBaseInfo(payload)
    return res
  },
  // 获取应用列表
  'user/application/list': async ({ commit }, payload) => {
    let res = await Api.user.getApplicationListByUserId(payload)
    return res
  }
}
