/**
 * Created by OXOYO on 2018/4/20.
 */

// 导入api
import Api from '../api'

export default {
  'list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getLogList(payload)
    return res
  }
}
