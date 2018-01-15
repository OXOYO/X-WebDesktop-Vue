/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  'appData/set': (state, data) => {
    state.appData = data
  },
  'appData/backup': (state, data) => {
    state._appData = data
  }
}
