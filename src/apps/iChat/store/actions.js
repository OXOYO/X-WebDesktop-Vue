/**
 * Created by OXOYO on 2018/4/20.
 */

// 导入api
import Api from '../api'

export default {
  'sendMessage': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doSendMessage(payload)
    return res
  }
}
