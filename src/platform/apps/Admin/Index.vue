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
