/**
 * Created by OXOYO on 2017/12/5.
 */

import state from './state'
import actions from './actions'
import mutations from './mutations'

export default {
  moduleName: 'Desktop',
  store: {
    namespaced: true,
    state,
    actions,
    mutations
  }
}
