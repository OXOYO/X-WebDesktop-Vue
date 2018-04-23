/**
 * Created by OXOYO on 2018/4/20.
 */

// 导入api
import Api from '../api'

export default {
  // 获取应用分类列表
  'category/list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getCategoryList(payload)
    return res
  },
  // 获取应用列表
  'application/list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getApplicationList(payload)
    return res
  }
}
