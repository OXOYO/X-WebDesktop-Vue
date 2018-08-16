/**
 * Created by OXOYO on 2017/12/5.
 */

import NoData from './NoData.vue'
import USwitch from './Switch.vue'
import WallpaperBackground from './WallpaperBackground.vue'

export default {
  components: {
    NoData,
    USwitch,
    WallpaperBackground
  },
  // 注册全局组件
  register: function (Vue) {
    let _t = this
    let components = _t.components
    for (let key in components) {
      if (key && components[key]) {
        Vue.component(key, components[key])
      }
    }
  }
}
