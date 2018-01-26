/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  'appData/set': (state, data) => {
    state.appData = JSON.parse(JSON.stringify(data))
  },
  'appData/backup': (state, data) => {
    state._appData = JSON.parse(JSON.stringify(data))
  }
}
