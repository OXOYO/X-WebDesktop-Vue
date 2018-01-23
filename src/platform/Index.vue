/**
* Created by OXOYO on 2017/12/24.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .layout-platform {
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
    class="layout-platform"
    @drop.stop.prevent="handlerDrop"
    @dragover.stop.prevent
    @click="handlerLeftClick($event)"
    @contextmenu.stop.prevent="handlerRightClick($event)"
  >
    <!-- 前台 -->
    <component :is="components.Home" v-if="!userInfo.isLogin">
      <component :is="components.Login"></component>
      <component :is="components.Wallpaper" :style="{ 'z-index': -10 }"></component>
    </component>
    <!-- 后台 -->
    <component :is="components.Admin" v-if="userInfo.isLogin">
      <!-- TODO Desktop 需要改造，主要由于 DesktopIcon && Window 均拖拽 -->
      <component
        :is="components.Desktop"
        :childComponents="{
         DesktopIcon: components.DesktopIcon,
         DesktopWidget: components.DesktopWidget,
         Window: components.Window,
         Wallpaper: components.Wallpaper
        }"
      >
        <!--
        <component :is="components.DesktopIconBox" :appData="appData"></component>
        <component :is="components.DesktopWidget"></component>
        -->
        <component :is="components.TaskBar">
          <component :is="components.StartMenu" slot="StartMenu"></component>
          <component :is="components.TaskBarIconBox" slot="TaskBarIconBox"></component>
          <component :is="components.TaskBarWidget" slot="TaskBarWidget"></component>
        </component>
        <!--
        <component :is="components.Window"></component>
        -->
        <!--<component :is="components.Wallpaper" :style="{ 'z-index': 1000 }"></component>-->
      </component>
    </component>
    <component :is="components.ContextMenu"></component>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import config from './config'
  import utils from '@/global/utils'
  const moduleName = utils.store.getModuleName('Platform')

  export default {
    name: 'Platform',
    data () {
      return {
        components: {},
        busTypes: {
          'desktop/left/click': 'desktop/left/click',
          'desktop/right/click': 'desktop/right/click'
        }
      }
    },
    computed: {
      ...mapState(moduleName, {
        userInfo: state => state.userInfo
      })
    },
    methods: {
      handlerComponents: async function () {
        let _t = this
        // 动态导入组件
        let components = {}
        // FIXME 可以考虑通过接口获取 components 配置信息
        for (let key in config.components) {
          let item = config.components[key]
          if (item.component) {
            try {
              // 1.加载组件
              components[key] = require('' + item.path + item.component)
            } catch (err) {
              console.log('components load error:', err.message)
            }
          }
          if (item.store) {
            try {
              // 2.加载store
              let storeObj = require('' + item.path + item.store)
              // 将store注册到 Platform 下
              _t.$store.registerModule(
                [
                  moduleName,
                  storeObj.default.moduleName
                ],
                storeObj.default.store
              )
            } catch (err) {
              console.log('store load error:', err.message)
            }
          }
          // if (item.routers) {
          //   try {
          //     // 3.加载路由
          //     let routersObj = require('' + item.path + item.routers)
          //     console.log('routersObj', routersObj.default)
          //     _t.$router.addRoutes(routersObj.default)
          //   } catch (err) {
          //     console.log('store load error:', err.message)
          //   }
          // }
        }
        _t.components = components
      },
      // 节点drop
      handlerDrop: function (event) {
        let _t = this
        // 获取拖拽对象数据
        let targetInfo = JSON.parse(event.dataTransfer.getData('Text'))
        // 判断类型
        if (targetInfo && targetInfo.type) {
          switch (targetInfo.type) {
            case 'Window':
              _t.handlerWindowDrag(targetInfo, event, 'drop')
              break
          }
        }
      },
      // 各种处理方法
      handlerWindowDrag: function (targetInfo, event, type) {
        let _t = this
        let data = targetInfo.data || {}
        // 健壮，防止空数据
        if (!Object.keys(data).length) {
          return
        }
        let tmpInfo = {}
        if (type === 'drop') {
          let xVal = event.clientX - data.offsetX
          let yVal = event.clientY - data.offsetY
          let style = {
            'margin-left': 0,
            'margin-top': 0,
            'left': xVal + 'px',
            'top': yVal + 'px'
          }
          tmpInfo = {
            window: {
              style: style
            }
          }
        }
        // TODO 处理应用拖拽后相关操作
        _t.$utils.bus.$emit('platform/desktop/right/click', tmpInfo)
      },
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
          target: 'platformIndex',
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
      }
    },
    created: function () {
      let _t = this
      _t.handlerComponents()
      // 监听事件
      _t.$utils.bus.$on('platform/refresh', function () {
        _t.$router.go(0)
      })
      _t.$utils.bus.$on('platform/fullScreen/open', function () {
        // 全屏
        let docElm = document.documentElement
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen()
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen()
        }
      })
      _t.$utils.bus.$on('platform/fullScreen/close', function () {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      })
    },
    beforeDestroy: function () {
      let _t = this
      _t.$utils.bus.$off([
        'platform/refresh',
        'platform/fullScreen/open',
        'platform/fullScreen/close'
      ])
    }
  }
</script>
