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
    @mousedown.left="mouseDownHandle"
    @click.stop="handleLeftClick($event)"
    @contextmenu.stop.prevent="handleRightClick($event)"
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
      // 鼠标按下
      mouseDownHandle: function () {
        let _t = this
        console.log('mouseDownHandle platform/window/preview/clear')
        // 广播事件
        _t.$utils.bus.$emit('platform/window/preview/clear')
      },
      // 桌面左键点击
      handleLeftClick: function () {
        let _t = this
        // 广播事件
        _t.$utils.bus.$emit('platform/startMenu/hide')
        _t.$utils.bus.$emit('platform/contextMenu/hide')
      },
      // 桌面右键点击
      handleRightClick: function (event) {
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
      getUserAppData: async function () {
        let _t = this
        // TODO 1.分发action，获取用户应用数据
        let res = await _t.$store.dispatch(_t.$utils.store.getType('Admin/user/application/list', 'Platform'))
        if (!res || res.status !== 200) {
          _t.$Message.error('获取用户应用列表失败')
          return
        }
        let appData = {
          list: [],
          iconList: [],
          showTitle: true
        }
        // 处理返回数据
        if (res.data && res.data.list && res.data.list.length) {
          _t.$Message.success(res.msg || '获取用户应用列表成功！')
          appData.list = res.data.list
          // 处理iconList
          appData.list.map(item => {
            let config = JSON.parse(item.config)
            appData.iconList.push({
              ...item,
              config: config
            })
          })
        } else {
          _t.$Message.info('暂无数据！')
        }
        let _appData = JSON.parse(JSON.stringify(appData))
        // 分发mutations，更新用户应用数据
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), appData)
        // 分发mutations，备份用户应用数据
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/backup', 'Platform'), _appData)
        _t.$nextTick(function () {
          // 广播事件，更新桌面图标布局
          _t.$utils.bus.$emit('platform/desktopIcon/render')
        })
      }
    },
    created: function () {
      let _t = this
      if (_t.userInfo.isLogin) {
        // 获取用户基本信息
        _t.getBaseInfo()
        // FIXME 获取用户应用数据
        _t.getUserAppData()
        // 监听事件，刷新用户应用数据
        _t.$utils.bus.$on('Admin/appData/refresh', function () {
          _t.getUserAppData()
        })
      }
    }
  }
</script>
