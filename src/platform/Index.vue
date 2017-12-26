/**
* Created by OXOYO on 2017/12/24.
*
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div>
    <!-- 前台 -->
    <component :is="components.Home" v-if="!isLogin">
      <component :is="components.Login"></component>
    </component>
    <!-- 后台 -->
    <component :is="components.Admin" v-if="isLogin">
      <component :is="components.Desktop">
        <component :is="components.DesktopIconBox" :appData="appData"></component>
        <component :is="components.DesktopWidget"></component>
        <component :is="components.TaskBar">
          <component :is="components.StartMenu" slot="StartMenu" :appData="appData"></component>
          <component :is="components.TaskBarIconBox" slot="TaskBarIconBox" :appData="appData"></component>
          <component :is="components.TaskBarWidget" slot="TaskBarWidget"></component>
        </component>
        <component :is="components.Window"></component>
      </component>
    </component>
    <component :is="components.ContextMenu"></component>
    <component :is="components.Wallpaper"></component>
    <Button type="info" style="position: absolute; z-index: 1500; top: 200px;" @click="toggleIsLogin">TOGGLE isLogin</Button>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import config from './config'

  export default {
    name: 'Platform',
    // components: {},
    data () {
      return {
        components: {},
        isLogin: false,
        appData: {
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
                name: 'AccountManagement',
                icon: '/static/app.png',
                title: '系统设置',
                x: 0,
                y: 480,
                index: ''
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
      }
    },
    methods: {
      toggleIsLogin: function () {
        let _t = this
        _t.isLogin = !_t.isLogin
      },
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
                  _t.$utils.store.getModuleName('Platform'),
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
        console.log('_t.components', _t.components)
      }
    },
    created: function () {
      let _t = this
      _t.handlerComponents()
    }
  }
</script>
