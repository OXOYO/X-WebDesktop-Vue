/**
 * Created by OXOYO on 2018/4/20.
 */

import state from './state'
import actions from './actions'
import mutations from './mutations'

// 导出module名称，用于动态注入store
export default {
  moduleName: 'GoFire',
  store: {
    namespaced: true,
    state,
    actions,
    mutations
  }
}
