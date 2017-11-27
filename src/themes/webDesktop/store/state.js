/**
 * Created by OXOYO on 2017/6/26.
 */

export default {
  userInfo: {
    // 是否已登录
    isSignIn: false,
    data: {}
  },
  // layout
  layout: {
    menus: {
      activeName: ''
    }
  },
  // 组件状态
  components: {
    contextMenu: {
      isShow: false,
      x: 0,
      y: 0
    },
    desktop: {
      showTitle: true,
      // 图标列表
      iconList: [
        /*
        {
          id: '',
          name: 'AccountManagement',
          icon: '/static/desktopIcon/AccountManagement.png',
          title: '账号管理',
          x: 0,
          y: 0,
          index: '',
          modal: {
            size: 'middle',
            isShow: false,
            zIndex: 600,
            enableResize: [
              'min',
              'max',
              'reset',
              'close'
            ],
            style: {
              'width': '1000px'
            }
          },
          taskBar: {
            isPinned: false
          }
        },
        {
          id: '',
          name: 'ApplicationMarket',
          icon: '/static/desktopIcon/ApplicationMarket.png',
          title: '应用管家',
          x: 0,
          y: 80,
          index: '',
          modal: {
            size: 'middle',
            isShow: false,
            zIndex: 600,
            enableResize: [
              'min',
              'max',
              'reset',
              'close'
            ]
          },
          taskBar: {
            isPinned: false
          }
        },
        {
          id: '',
          name: 'MyApplication',
          icon: '/static/desktopIcon/MyApplication.png',
          title: 'My Apps',
          x: 0,
          y: 160,
          index: '',
          modal: {
            size: 'middle',
            isShow: false,
            zIndex: 600,
            enableResize: [
              'min',
              'max',
              'reset',
              'close'
            ]
          },
          taskBar: {
            isPinned: false
          }
        },
        {
          id: '',
          name: 'PermissionApply',
          icon: '/static/desktopIcon/PermissionApply.png',
          title: '权限申请',
          x: 0,
          y: 240,
          index: '',
          modal: {
            size: 'middle',
            isShow: false,
            zIndex: 600,
            enableResize: [
              'min',
              'max',
              'reset',
              'close'
            ]
          },
          taskBar: {
            isPinned: false
          }
        },
        {
          id: '',
          name: 'PermissionAudit',
          icon: '/static/desktopIcon/PermissionAudit.png',
          title: '权限审核',
          x: 0,
          y: 320,
          index: '',
          modal: {
            size: 'middle',
            isShow: false,
            zIndex: 600,
            enableResize: [
              'min',
              'max',
              'reset',
              'close'
            ]
          },
          taskBar: {
            isPinned: false
          }
        },
        {
          id: '',
          name: 'PersonalCenter',
          icon: '/static/desktopIcon/PersonalCenter.png',
          title: '个人中心',
          x: 0,
          y: 400,
          index: '',
          modal: {
            size: 'max',
            isShow: false,
            zIndex: 600,
            enableResize: [
              'min',
              'max',
              'reset',
              'close'
            ]
          },
          taskBar: {
            isPinned: false
          }
        },
        {
          id: '',
          name: 'AccountManagement',
          icon: '/static/desktopIcon/SystemSetting.png',
          title: '系统设置',
          x: 0,
          y: 480,
          index: '',
          modal: {
            size: 'middle',
            isShow: false,
            zIndex: 600,
            enableResize: [
              'min',
              'max',
              'reset',
              'close'
            ]
          },
          taskBar: {
            isPinned: false
          }
        }
        */
      ]
    },
    taskBarBox: {
      // 图标列表
      iconMap: {}
    },
    appModalBox: {
      // 是否显示
      isShow: false,
      // 弹窗列表
      modalMap: {},
      // 窗口缩放
      reSize: {
        // 是否开始缩放
        isStartResize: false,
        appName: ''
      }
    },
    templateSwitch: {
      isShow: true,
      // 是否显示列表
      isShowList: false,
      // 是否开始拖拽标识
      isStartDrag: false,
      // 当前模板
      currentTemplate: 'webDesktop',
      // 模板列表 FIXME 后期应该存入数据库，通过ajax获取
      templateMap: {
        'webDesktop': {
          name: 'webDesktop',
          title: 'Win7',
          index: 0,
          icon: '/static/templateSwitch/win.png',
          description: ''
        },
        'normalLayout': {
          name: 'normalLayout',
          title: 'normalLayout',
          index: 1,
          icon: '/static/templateSwitch/normal.png',
          description: '传统风格'
        }
      },
      style: {}
    },
    startMenu: {
      isShow: false,
      isLocked: false,
      info: {
        app: {
          icon: '/static/desktopIcon/StartMenu.png',
          x: 0,
          y: 480,
          index: '',
          name: 'StartMenu',
          stateName: 'startMenu'
        },
        modal: {
          size: 'middle',
          isShow: false,
          zIndex: 600,
          enableResize: ['min', 'max', 'reset', 'close']
        },
        taskBar: {
          isPinned: true
        }
      },
      appList: []
    }
  }
}
