/**
* Created by OXOYO on 2018/1/12.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-window-modal {
    width: 100%;
    height: 100%;
    background: #ffffff;

    .load-complete {
      display: inline-block;
      width: 100%;
      text-align: center;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      margin: 20px 0;

      &.load-success {
        color: #19be6b;
      }
      &.load-fail {
        color: #ed3f14;
      }
      .load-text {
        display: inline-block;
      }
      .load-text-strong {
        color: #000000;
      }
    }
  }
</style>

<template>
  <div class="app-window-modal">
    <div
      :class="{ 'load-complete': true, 'load-fail': !appComponent }"
      v-show="!appComponent"
    >
      <Icon type="close-circled"></Icon>
      <div class="load-text">加载应用程序</div>
      <div class="load-text load-text-strong">{{ info.app_title || info.config.app.title }}</div>
      <div class="load-text">失败！</div>
    </div>
    <component :is="appComponent" v-if="appComponent" :info="info"></component>
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
        let appName = _t.info.app_name || _t.info.config.app.name
        let path = ''
        // TODO 判断当前操作是install || uninstall || openApp
        // 常规打开
        let handler = function (path) {
          // 动态加载组件
          require.ensure([], (require) => {
            let isSuccess = false
            try {
              let appComponent = require('@/Apps/' + path + '/Index.vue')
              _t.appComponent = appComponent
              isSuccess = true
            } catch (err) {
              isSuccess = false
              console.warn('WARNG:: LOAD', '@/Apps/' + path + '/Index.vue', 'FAIL!')
            }
            if (!isSuccess && _t.info.hasOwnProperty('action')) {
              if (_t.info.action === 'install') {
                path = 'Install'
              } else if (_t.info.action === 'uninstall') {
                path = 'Uninstall'
              }
              try {
                let appComponent = require('@/global/components/' + path + '.vue')
                _t.appComponent = appComponent
              } catch (err) {
                console.warn('WARNG:: LOAD', '@/global/components/' + path + '.vue', 'FAIL!')
              }
            }
          })
        }
        console.log('loadApp _t.info', _t.info)
        if (_t.info.hasOwnProperty('action')) {
          if (_t.info.action === 'install') {
            path = appName + '/install'
          } else if (_t.info.action === 'uninstall') {
            path = appName + '/uninstall'
          } else {
            path = appName
          }
        } else {
          path = appName
        }
        handler(path)
      }
    },
    created: function () {
      let _t = this
      // 初始化窗口
      _t.init()
    }
  }
</script>

