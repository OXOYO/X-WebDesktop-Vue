/**
* Created by OXOYO on 2018/1/12.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-window-modal {
    width: 100%;
    height: 100%;
    background: #ffffff;

    .loading {
      display: inline-block;
      margin-top: 10px;

      .loading-icon{
        animation: loading-spin 1s linear infinite;
      }
      @keyframes loading-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
      }
    }

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
    <div class="loading" v-show="loadStatus === 'loading'">
      <Spin fix>
        <Icon class="loading-icon" type="load-c" size=18></Icon>
        <div class="loading-text">加载中...</div>
      </Spin>
    </div>
    <div
      v-show="loadStatus === 'fail'"
      :class="{ 'load-complete': true, 'load-fail': loadStatus === 'fail' }"
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
        appComponent: null,
        // 加载状态 loading：加载中 fail：加载失败 success：加载成功
        loadStatus: ''
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
        _t.loadStatus = 'loading'
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
                isSuccess = true
              } catch (err) {
                isSuccess = false
                console.warn('WARNG:: LOAD', '@/global/components/' + path + '.vue', 'FAIL!')
              }
            }
            // 更新加载状态
            _t.loadStatus = isSuccess ? 'success' : 'fail'
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

