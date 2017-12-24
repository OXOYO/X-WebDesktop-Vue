/**
 * Created by OXOYO on 2017/12/5.
 */

import Api from '../api'

export default {
  // 获取bing壁纸
  'bing': async ({ commit }, payload) => {
    let res = await Api.getBingWallpaper(payload)
    return res
  }
}
