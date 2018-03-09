/**
* Created by OXOYO on 2018/1/12.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-window-modal {
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div class="app-window-modal">
    <h1 v-if="!appComponent">TODO WinModal</h1>
    <h1 v-if="!appComponent">{{ info.app.title }}</h1>
    <component :is="appComponent" v-if="appComponent"></component>
  </div>
</template>

<script>
  export default {
    name: 'WinModal',
    props: {
      info: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        appComponent: null
      }
    },
    methods: {
      // 初始化
      init: function () {
        let _t = this
        // 加载应用
        _t.loadApp()
      },
      // 加载应用
      loadApp: function () {
        let _t = this
        let appName = _t.info.app.name
        // 动态加载组件
        require.ensure([], (require) => {
          try {
            let appComponent = require('@/Apps/' + appName + '/Index.vue')
            _t.appComponent = appComponent
          } catch (err) {
            console.warn('WARNG:: LOAD', '@/Apps/' + appName + '/Index.vue', 'FAIL!')
          }
        })
      }
    },
    created: function () {
      let _t = this
      // 初始化窗口
      _t.init()
    }
  }
</script>

