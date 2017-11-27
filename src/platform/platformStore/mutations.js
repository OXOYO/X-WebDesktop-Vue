/**
 * Created by OXOYO on 2017/7/13.
 */

export default {
  'user/update': (state, data) => {
    state.userInfo = {
      ...data
    }
  },
  // 切换壁纸
  'components/wallpaper/switch': (state, data) => {
    state.components.wallpaper.switch = data
  }
}
