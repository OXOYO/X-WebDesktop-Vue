/**
 * Created by OXOYO on 2017/6/26.
 */

import * as Types from './types'

export default {
  // 登录
  [Types.PLATFORM_SIGN_IN_SUCCESS] (state, data) {
    state.userInfo.isSignIn = true
    state.userInfo.data = {
      ...state.userInfo.data,
      ...data
    }
  },
  [Types.PLATFORM_SIGN_IN_SUCCESS] (state, data) {
    state.userInfo.isSignIn = false
    state.userInfo.data = {
      ...state.userInfo.data,
      ...data
    }
  },
  // 桌面右键菜单
  'components/contextMenu/update': (state, data) => {
    state.components.contextMenu = {
      ...data
    }
  },
  // 更新桌面图标数据
  'components/desktop/update': (state, data) => {
    state.components.desktop = {
      ...data
    }
  },
  'components/appModalBox/toggleApp': (state, data) => {
    // 判断是否移除
    // if (data.closeApp) {
    //   let modalMap = {
    //     ...state.components.appModalBox.modalMap
    //   }
    //   delete modalMap[data.name]
    //   state.components.appModalBox.modalMap = modalMap
    // } else {
    state.components.appModalBox.modalMap = {
      ...state.components.appModalBox.modalMap,
      [data.app.name]: data
    }
    // }
  },
  // 切换窗口层级
  'components/appModalBox/changeZIndex': (state, data) => {
    let modalMap = state.components.appModalBox.modalMap
    let keysArr = Object.keys(modalMap)
    let defZIndex = 600
    let i = 0
    for (let key of keysArr) {
      let item = modalMap[key]
      if (item.app.name !== data.app.name) {
        modalMap[key].modal.zIndex = defZIndex + i
        i++
      }
    }
    data.modal.zIndex = defZIndex + i
    state.components.appModalBox.modalMap = {
      ...modalMap,
      [data.app.name]: data
    }
  },
  // 窗口缩放
  'components/appModalBox/reSize/update': (state, data) => {
    state.components.appModalBox.reSize = data
  },
  // 初始化任务栏图标信息
  'components/taskBarBox/initIconMap': (state, data) => {
    state.components.taskBarBox.iconMap = {
      ...data
    }
  },
  // 更新任务栏图标信息
  'components/taskBarBox/toggleApp': (state, data) => {
    // 判断是否移除
    if (data.closeApp) {
      // 判断是否锁定
      if (!data.taskBar.isPinned) {
        let iconMap = {
          ...state.components.taskBarBox.iconMap
        }
        delete iconMap[data.app.name]
        state.components.taskBarBox.iconMap = {
          ...iconMap
        }
      } else {
        data.closeApp = false
        state.components.taskBarBox.iconMap = {
          ...state.components.taskBarBox.iconMap,
          [data.app.name]: data
        }
      }
    } else {
      state.components.taskBarBox.iconMap = {
        ...state.components.taskBarBox.iconMap,
        [data.app.name]: data
      }
    }
  },
  // 切换模板
  'components/templateSwitch/update': (state, data) => {
    state.components.templateSwitch = {
      ...state.components.templateSwitch,
      ...data
    }
  },
  // 切换开始菜单显示
  'components/startMenu/isShow/update': (state, data) => {
    state.components.startMenu.isShow = !state.components.startMenu.isShow
  },
  // 切换开始菜单lock
  'components/startMenu/isLocked/update': (state, data) => {
    state.components.startMenu.isLocked = data
  },
  // 更新开始菜单应用列表
  'components/startMenu/appList/update': (state, data) => {
    state.components.startMenu.appList = data
  }
}
