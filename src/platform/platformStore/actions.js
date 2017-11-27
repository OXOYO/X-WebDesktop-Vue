/**
 * Created by OXOYO on 2017/7/13.
 */

// 导入api
import Api from '../api'

export default {
  'config/user': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.config.getPlatformConfigByUserId(payload)
    return res
  },
  'user/signIn': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.user.doSignIn(payload)
    return res
  },
  'user/BaseInfo': async({commit}, payload) => {
    let res = await Api.user.getBaseInfo(payload)
    return res
  },
  // 获取bing壁纸
  'components/wallpaper/bing': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.components.getBingWallpaper(payload)
    return res
  }
}
