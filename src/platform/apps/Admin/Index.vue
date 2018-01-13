/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-admin {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
</style>

<template>
  <div
    class="app-admin"
    @click.stop="handlerLeftClick($event)"
    @contextmenu.stop.prevent="handlerRightClick($event)"
  >
    <slot></slot>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import utils from '@/global/utils'
  const moduleName = utils.store.getModuleName('Platform')

  export default {
    name: 'Admin',
    computed: {
      ...mapState(moduleName, {
        userInfo: state => {
          return state.userInfo
        }
      })
    },
    methods: {
      // 桌面左键点击
      handlerLeftClick: function () {
        let _t = this
        // 广播事件
        _t.$utils.bus.$emit('platform/startMenu/hide')
        _t.$utils.bus.$emit('platform/contextMenu/hide')
      },
      // 桌面右键点击
      handlerRightClick: function (event) {
        let _t = this
        let xVal = parseInt(event.clientX)
        let yVal = parseInt(event.clientY)
        // 菜单信息
        let contextMenuInfo = {
          isShow: true,
          x: xVal,
          y: yVal,
          target: 'admin',
          list: [
            {
              name: 'refresh',
              icon: {
                type: 'refresh',
                style: ''
              },
              text: '刷新',
              enable: true,
              action: {
                type: 'bus',
                handler: 'platform/refresh'
              }
            },
            {
              name: 'iconSort',
              icon: {
                type: '',
                style: ''
              },
              text: '排序方式',
              enable: true,
              children: [
                {
                  name: 'top-bottom-left-right',
                  icon: {
                    type: '',
                    style: ''
                  },
                  text: '从上往下，从左往右',
                  enable: true,
                  style: {},
                  action: {
                    type: 'bus',
                    handler: 'platform/desktopIcon/sort',
                    params: 'top-bottom-left-right'
                  }
                },
                {
                  name: 'top-bottom-right-left',
                  icon: {
                    type: '',
                    style: ''
                  },
                  text: '从上往下，从右往左',
                  enable: true,
                  style: {},
                  action: {
                    type: 'bus',
                    handler: 'platform/desktopIcon/sort',
                    params: 'top-bottom-right-left'
                  }
                },
                {
                  name: 'bottom-top-left-right',
                  icon: {
                    type: '',
                    style: ''
                  },
                  text: '从下往上，从左往右',
                  enable: true,
                  style: {},
                  action: {
                    type: 'bus',
                    handler: 'platform/desktopIcon/sort',
                    params: 'bottom-top-left-right'
                  }
                },
                {
                  name: 'bottom-top-right-left',
                  icon: {
                    type: '',
                    style: ''
                  },
                  text: '从下往上，从右往左',
                  enable: true,
                  style: {},
                  action: {
                    type: 'bus',
                    handler: 'platform/desktopIcon/sort',
                    params: 'bottom-top-right-left'
                  }
                },
                {
                  name: 'left-right-top-bottom',
                  icon: {
                    type: '',
                    style: ''
                  },
                  text: '从左往右，从上往下',
                  enable: true,
                  style: {},
                  action: {
                    type: 'bus',
                    handler: 'platform/desktopIcon/sort',
                    params: 'left-right-top-bottom'
                  }
                },
                {
                  name: 'left-right-bottom-top',
                  icon: {
                    type: '',
                    style: ''
                  },
                  text: '从左往右，从下往上',
                  enable: true,
                  style: {},
                  action: {
                    type: 'bus',
                    handler: 'platform/desktopIcon/sort',
                    params: 'left-right-bottom-top'
                  }
                },
                {
                  name: 'right-left-top-bottom',
                  icon: {
                    type: '',
                    style: ''
                  },
                  text: '从右往左，从上往下',
                  enable: true,
                  style: {},
                  action: {
                    type: 'bus',
                    handler: 'platform/desktopIcon/sort',
                    params: 'right-left-top-bottom'
                  }
                },
                {
                  name: 'right-left-bottom-top',
                  icon: {
                    type: '',
                    style: ''
                  },
                  text: '从右往左，从下往上',
                  enable: true,
                  style: {},
                  action: {
                    type: 'bus',
                    handler: 'platform/desktopIcon/sort',
                    params: 'right-left-bottom-top'
                  }
                }
              ],
              childrenStyle: {
                width: '160px',
                marginRight: '-160px'
              }
            },
            {
              name: 'fullScreen',
              icon: {
                type: 'arrow-expand',
                style: ''
              },
              text: '全屏',
              enable: true,
              action: {
                type: 'bus',
                handler: 'platform/fullScreen/open'
              }
            },
            {
              name: 'cancelFullScreen',
              icon: {
                type: 'arrow-shrink',
                style: ''
              },
              text: '取消全屏',
              enable: true,
              action: {
                type: 'bus',
                handler: 'platform/fullScreen/close'
              }
            },
            {
              name: 'wallpaper',
              icon: {
                type: '',
                style: ''
              },
              text: '切换壁纸',
              enable: true,
              action: {
                type: 'bus',
                handler: 'platform/wallpaper/switch'
              }
            }
          ]
        }
        // 广播事件
        _t.$utils.bus.$emit('platform/contextMenu/show', contextMenuInfo)
      },
      // 获取用户基本信息
      getBaseInfo: async function () {
        let _t = this
        // 分发action，获取当前登录用户基本信息
        let res = await _t.$store.dispatch(_t.$utils.store.getType('Admin/user/BaseInfo', 'Platform'))
        if (!res) {
          _t.$Message.error('获取用户基本信息失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res.data) {
          _t.$Message.success(res.msg || '获取用户基本信息成功！')
          let userInfo = res.data
          // 分发mutations，更新用户基本信息
          _t.$store.commit(_t.$utils.store.getType('userInfo/update', 'Platform'), {
            ..._t.userInfo,
            ...userInfo
          })
        } else {
          _t.$Message.info('暂无数据！')
        }
      },
      // 获取用户应用数据
      getUserAppData: function () {
        let _t = this
        // TODO 1.分发action，获取用户应用数据
        let appData = {
          // FIXME 数据结构有待调整规范
          iconList: [
            {
              app: {
                id: '',
                name: 'AccountManagement',
                icon: '/static/app.png',
                title: '账号管理',
                x: 0,
                y: 0,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'open',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
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
              app: {
                id: '',
                name: 'ApplicationMarket',
                icon: '/static/app.png',
                title: '应用管家',
                x: 0,
                y: 80,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'open',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'MyApplication',
                icon: '/static/app.png',
                title: 'My Apps',
                x: 0,
                y: 160,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'PermissionApply',
                icon: '/static/app.png',
                title: '权限申请',
                x: 0,
                y: 240,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'PermissionAudit',
                icon: '/static/app.png',
                title: '权限审核',
                x: 0,
                y: 320,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'PersonalCenter',
                icon: '/static/app.png',
                title: '个人中心',
                x: 0,
                y: 400,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'max',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'SystemSetting',
                icon: '/static/app.png',
                title: '系统设置',
                x: 0,
                y: 480,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'SystemSetting01',
                icon: '/static/app.png',
                title: '系统设置01',
                x: 0,
                y: 480,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'SystemSetting02',
                icon: '/static/app.png',
                title: '系统设置02',
                x: 0,
                y: 480,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'SystemSetting03',
                icon: '/static/app.png',
                title: '系统设置03',
                x: 0,
                y: 480,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'SystemSetting04',
                icon: '/static/app.png',
                title: '系统设置04',
                x: 0,
                y: 480,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            },
            {
              app: {
                id: '',
                name: 'SystemSetting05',
                icon: '/static/app.png',
                title: '系统设置05',
                x: 0,
                y: 480,
                index: ''
              },
              desktopIcon: {
                style: {
                  left: '',
                  top: ''
                }
              },
              window: {
                size: 'middle',
                status: 'close',
                zIndex: 600,
                type: 'modal',
                enableResize: [
                  'custom',
                  'small',
                  'min',
                  'max',
                  'middle',
                  'reset',
                  'close'
                ]
              },
              taskBar: {
                isPinned: false
              }
            }
          ],
          showTitle: true
        }
        _t.$Message.success('获取用户应用数据成功！')
        // 分发mutations，更新用户应用数据
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), appData)
      }
    },
    created: function () {
      let _t = this
      if (_t.userInfo.isLogin) {
        // 获取用户基本信息
        _t.getBaseInfo()
        // FIXME 获取用户应用数据
        _t.getUserAppData()
      }
    }
  }
</script>
