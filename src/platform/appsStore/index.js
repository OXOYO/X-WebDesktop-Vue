/**
 * Created by OXOYO on 2017/7/13.
 */

import state from './state'
import actions from './actions'
import mutations from './mutations'

export default {
  moduleName: 'Apps',
  store: {
    namespaced: true,
    state,
    actions,
    mutations
  }
}
