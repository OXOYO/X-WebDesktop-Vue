/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  'userInfo/update': (state, data) => {
    state.userInfo = {
      ...data
    }
  },
  'userInfo/reset': (state, data) => {
    state.userInfo = {
      isLogin: false
    }
  }
}
