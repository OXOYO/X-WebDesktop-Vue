/**
* Created by OXOYO on 2017/7/13.
*
* 系统首页
*/

<style scoped lang="less" rel="stylesheet/less">
  .platform-main {
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div class="platform-main">
    <router-view v-if="$route.name !== 'platform.index'"></router-view>
    <!-- 加载主题组件 -->
    <component v-if="themeComponent && $route.name === 'platform.index'" :is="themeComponent"></component>
  </div>
</template>

<script>
  export default {
    name: 'PlatformIndex',
    data () {
      return {
        defPlatformConfig: {
          themes: {
            name: 'webDesktop',
            config: {}
          }
        },
        themeComponent: null
      }
    },
    watch: {
      '$route.name': function (val) {
        let _t = this
        if (val === 'platform.index') {
          _t.loadThemeComponent()
        }
      }
    },
    methods: {
      // 获取用户基本信息
      getBaseInfo: async function () {
        let _t = this
        // 分发action，获取当前登录用户基本信息
        let res = await _t.$store.dispatch('Platform/user/BaseInfo')
        res = _t.$utils.Serv.handleRes(_t, res, true)
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
          _t.$store.commit('Platform/user/update', userInfo)
        } else {
          _t.$Message.info('暂无数据！')
        }
      },
      loadThemeComponent: async function () {
        let _t = this
        if (_t.$route.name !== 'platform.signin') {
          // 分发action，执行查询
          let res = await _t.$store.dispatch('Platform/config/user', {
            userId: 1
          })
          res = _t.$utils.Serv.handleRes(_t, res, true)
          if (!res) {
            _t.$Message.error('获取系统配置失败！')
            return
          } else if (res.status !== 200) {
            return
          }
          // TODO 解析返回数据，获取配置信息
          let platformConfig
          if (res && res.data && res.data.config) {
            platformConfig = JSON.parse(res.data.config)
          } else {
            platformConfig = _t.defPlatformConfig
          }
          // 根据配置信息加载相应的布局组件
          let themeName = platformConfig.themes.name
          // 动态加载store
          require.ensure([], (require) => {
            let themeStore = (require('../../themes/' + themeName + '/store/index.js')).default
            // 将store注入
            _t.$store.registerModule(['Platform', themeStore.moduleName], themeStore.store)
            // 动态加载组件
            require.ensure([], (require) => {
              _t.themeComponent = require('../../themes/' + themeName + '/pages/Index.vue')
            })
          })
        }
      }
    },
    created: function () {
      // TODO 进入首页，拉取用户信息，用户系统配置信息
      let _t = this
      _t.loadThemeComponent()
    },
    mounted: function () {
      let _t = this
      // 获取用户信息
      _t.getBaseInfo()
    }
  }
</script>

