/**
 * Created by OXOYO on 2017/12/5.
 */

import Api from '../api'

export default {
  // 执行应用安装
  'application/install': async ({ commit }, payload) => {
    let res = await Api.doInstall(payload)
    return res
  }
}
