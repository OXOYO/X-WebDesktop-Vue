/**
* Created by OXOYO on 2018/4/23.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: center;
    overflow: hidden;

    .iframe-box {
      margin: 0 auto;
      width: 100%;
      height: 100%;
    }
  }
</style>

<template>
  <div class="main-page">
    <iframe
      class="iframe-box"
      name="iframe-box"
      :src="appPath"
      :width="appWidth"
      :height="appHeight"
      frameborder="0"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
    >
    </iframe>
  </div>
</template>

<script>
  export default {
    name: 'MainPage',
    data () {
      return {
        appPath: null,
        appWidth: 0,
        appHeight: 0
      }
    },
    props: {
      info: {
        type: Object
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
        _t.$nextTick(function () {
          _t.appWidth = parseInt(_t.$el.offsetWidth)
          _t.appHeight = parseInt(_t.$el.offsetHeight)
          _t.appPath = '//wx.qq.com'
          document.body.onbeforeunload = function (event) {
            if (!window.event) {
              event.returnValue = false
            } else {
              window.event.returnValue = false
            }
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
