/**
 * Created by OXOYO on 2017/12/24.
 *
 * 接口
 */
import Vue from 'vue'

export default {
// 获取bing壁纸
  getBingWallpaper: async (data) => {
    let res = await Vue.prototype.$http.get('/Platform/components/wallpaper/bing', {
      params: data
    })
    return res
  }
}
