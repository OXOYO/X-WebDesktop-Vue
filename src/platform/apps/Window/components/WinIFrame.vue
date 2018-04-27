/**
* Created by OXOYO on 2018/1/12.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-window-iframe {
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
  <div class="app-window-iframe">
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
    <iframe
      :src="appPath"
      :width="appWidth"
      :height="appHeight"
      frameborder="0"
    >
    </iframe>
  </div>
</template>

<script>
  export default {
    name: 'WinIFrame',
    props: {
      info: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        appPath: null,
        appWidth: 0,
        appHeight: 0,
        // 加载状态 loading：加载中 fail：加载失败 success：加载成功
        loadStatus: ''
      }
    },
    watch: {
      info: {
        handler: function () {
          let _t = this
          // 初始化窗口
          _t.init()
        },
        deep: true
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
        setTimeout(function () {
          _t.appPath = _t.info.config.app.url
          // FIXME 此处计算宽高存在bug，不能与窗口缩放同步
          _t.appWidth = parseInt(_t.info.config.window.style.width) - 20
          _t.appHeight = parseInt(_t.info.config.window.style.height) - 40
          _t.loadStatus = _t.appPath ? 'success' : 'fail'
        }, 5000)
        document.body.onbeforeunload = function (event) {
          let rel = 'asdfawfewf'
          if (!window.event) {
            event.returnValue = rel
          } else {
            window.event.returnValue = rel
          }
        }
      }
    },
    created: function () {
      let _t = this
      // 初始化窗口
      _t.init()
    }
  }
</script>

