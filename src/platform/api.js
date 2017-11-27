/**
 * Created by OXOYO on 2017/7/13.
 */

import Vue from 'vue'

// 初始化平台，拉取用户平台配置信息
export default {
  config: {
    getPlatformConfigByUserId: async (data) => {
      Vue.prototype.$Loading.start()
      let res = await Vue.prototype.$http.get(
        Vue.prototype.$utils.Serv.handleUrl('/Platform/config/user'),
        {
          params: Vue.prototype.$utils.Serv.handleParams(data)
        }
      )
      Vue.prototype.$Loading.finish()

      return res
    }
  },
  user: {
    doSignIn: async (data) => {
      Vue.prototype.$Loading.start()
      let res = await Vue.prototype.$http.post(
        Vue.prototype.$utils.Serv.handleUrl('/Platform/user/signIn'),
        Vue.prototype.$utils.Serv.handleParams(data)
      )
      Vue.prototype.$Loading.finish()

      return res
    },
    // 获取用户基本信息
    getBaseInfo: async (data) => {
      Vue.prototype.$Loading.start()
      let res = await Vue.prototype.$http.get(
        Vue.prototype.$utils.Serv.handleUrl('/Platform/user/BaseInfo')
      )
      Vue.prototype.$Loading.finish()

      return res
    }
  },
  components: {
    // 获取bing壁纸
    getBingWallpaper: async (data) => {
      Vue.prototype.$Loading.start()
      let res = await Vue.prototype.$http.get(
        Vue.prototype.$utils.Serv.handleUrl('/Platform/components/wallpaper/bing'),
        // '//cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1',
        {
          params: Vue.prototype.$utils.Serv.handleParams(data)
        }
      )
      Vue.prototype.$Loading.finish()

      return res
    }
  }
}
