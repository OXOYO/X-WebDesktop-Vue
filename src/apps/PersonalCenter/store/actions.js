/**
 * Created by OXOYO on 2017/10/9.
 */

// 导入api
import Api from '../api'

export default {
  // 获取账号列表
  'BaseInfo': async({commit}, payload) => {
    // 调接口
    let res = await Api.getBaseInfo(payload)
    return res
  }
}
