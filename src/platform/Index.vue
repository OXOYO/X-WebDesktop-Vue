/**
* Created by OXOYO on 2017/12/24.
*
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div>
    <!--
    &lt;!&ndash; 前台 &ndash;&gt;
    <Home>
      <Login></Login>
    </Home>
    &lt;!&ndash; 后台 &ndash;&gt;
    <Admin>
      <Desktop>
        <DesktopIcon></DesktopIcon>
        <DesktopWidget></DesktopWidget>
        <TaskBar>
          <StartMenu></StartMenu>
          <TaskBarIcon></TaskBarIcon>
          <TaskBarWidget></TaskBarWidget>
        </TaskBar>
        <Window></Window>
      </Desktop>
    </Admin>
    <ContextMenu></ContextMenu>
    -->
    <component :is="components.Home" v-show="$route.name.includes('platform.home')">
      <component :is="components.Login"></component>
    </component>
    <component :is="components.Admin" v-show="$route.name.includes('platform.admin')">
      <component :is="components.Desktop">
        <component :is="components.DesktopIcon"></component>
        <component :is="components.DesktopWidget"></component>
        <component :is="components.TaskBar">
          <component :is="components.StartMenu"></component>
          <component :is="components.TaskBarIcon"></component>
          <component :is="components.TaskBarWidget"></component>
        </component>
        <component :is="components.Window"></component>
      </component>
    </component>
    <component :is="components.ContextMenu"></component>
    <component :is="components.Wallpaper"></component>
  </div>
</template>

<script>
  import config from './config'

  export default {
    name: 'Platform',
    // components: {},
    data () {
      return {
        components: {}
      }
    },
    methods: {
      handlerComponents: async function () {
        let _t = this
        // 动态导入组件
        let components = {}
        // FIXME 可以考虑通过接口获取 components 配置信息
        for (let key in config.components) {
          let item = config.components[key]
          try {
            components[key] = require('' + item.path + item.component)
            let storeObj = require('' + item.path + item.store)
            console.log('store', storeObj, storeObj.default.moduleName)
            // 将store注册到 Platform 下
            _t.$store.registerModule(
              [
                _t.$utils.store.getModuleName('Platform'),
                storeObj.default.moduleName
              ],
              storeObj.default.store
            )
          } catch (err) {
            console.log(err.message)
          }
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
