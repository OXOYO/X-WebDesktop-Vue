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
    delete tabPageMap[data]
    if (!Object.keys(tabPageMap).length) {
      tabPageMap[Object.keys(tabPageMap).length] = JSON.parse(JSON.stringify(state.homePage))
    }
    state.tabPageMap = {
      ...tabPageMap
    }
    state.currentTabIndex = (data - 1 > -1 ? data - 1 : 0) + ''
  },
  'tab/add': (state, data) => {
    let tabPageMap = {
      ...state.tabPageMap
    }
    tabPageMap[Object.keys(tabPageMap).length] = JSON.parse(JSON.stringify(state.newTab))
    state.tabPageMap = {
      ...tabPageMap
    }
    state.currentTabIndex = Object.keys(tabPageMap).length - 1 + ''
  },
  'tab/update': (state, data) => {
    console.log('data', data)
    state.tabPageMap[data.index] = data.info
  }
}
