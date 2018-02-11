/**
 * Created by OXOYO on 2017/7/14.
 */

export default {
  // 更新当前激活的tab
  'currentTab/update': (state, data) => {
    state.currentTab = data
  },
  // 更新当前编辑的账号
  'currentEditAccount/update': (state, data) => {
    state.currentEditAccount = data
  }
}
