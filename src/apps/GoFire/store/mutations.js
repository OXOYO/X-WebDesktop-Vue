/**
 * Created by OXOYO on 2018/4/20.
 */

export default {
  // 激活tab
  'tab/active': (state, data) => {
    state.currentTabIndex = data + ''
  },
  // 关闭tab
  'tab/close': (state, data) => {
    let tabPageMap = {
      ...state.tabPageMap
    }
    let targetIndex = Object.keys(tabPageMap).indexOf(data)
    if (targetIndex > -1) {
      if (Object.keys(tabPageMap).length > 1) {
        if (targetIndex === 0) {
          state.currentTabIndex = Object.keys(tabPageMap)[targetIndex + 1] + ''
        } else {
          state.currentTabIndex = Object.keys(tabPageMap)[targetIndex - 1] + ''
        }
      }
      // 执行删除操作
      delete tabPageMap[data]
      if (!Object.keys(tabPageMap).length) {
        let tabIndex = '0'
        tabPageMap[tabIndex] = JSON.parse(JSON.stringify(state.newTab))
        state.currentTabIndex = tabIndex
      }
      state.tabPageMap = {
        ...tabPageMap
      }
    }
  },
  'tab/add': (state, data) => {
    let tabPageMap = {
      ...state.tabPageMap
    }
    let tabIndex = parseInt(Object.keys(tabPageMap)[Object.keys(tabPageMap).length - 1 > 0 ? Object.keys(tabPageMap).length - 1 : 0]) + 1 + ''
    tabPageMap[tabIndex] = JSON.parse(JSON.stringify(state.newTab))
    state.tabPageMap = {
      ...tabPageMap
    }
    state.currentTabIndex = tabIndex
  },
  'tab/update': (state, data) => {
    state.tabPageMap[data.index] = data.info
  }
}
