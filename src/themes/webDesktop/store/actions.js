/**
 * Created by OXOYO on 2017/6/26.
 */
// 导入api
import Api from '../api'

// TODO action功能细化
export default {
  // 打开/关闭应用
  'components/appModalBox/toggleApp': ({ commit }, payload) => {
    // 处理iframe显示方式
    if (payload.modal.type && payload.modal.type === 'iframe') {
      commit('components/appModalBox/toggleApp', payload)
      // 处理modal显示方式
    } else {
      let appName = payload.app.name
      // 动态加载组件
      require.ensure([], (require) => {
        let app = require('@/Apps/' + appName + '/Index.vue')
        payload.component = app
        commit('components/appModalBox/toggleApp', payload)
      })
    }
  },
  // 更新用户应用信息
  'application/pinned/update': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.doAppPinnedUpdate(payload)
    return res
  },
  // 获取当前用户桌面应用列表
  'application/list': async ({ commit }, payload) => {
    // 调接口
    let res = await Api.getApplicationListByUserId(payload)
    return res
  }
}
