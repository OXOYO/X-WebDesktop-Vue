/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-window {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 8888;
    background: #fff;
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, .1);
    writing-mode: horizontal-tb;

    &.app-window-small {
      width: 300px;
      height: 200px;
      margin-left: -150px;
      margin-top: -100px;
    }
    &.app-window-middle {
      width: 800px;
      height: 600px;
      margin-left: -400px;
      margin-top: -300px;
    }
    &.app-window-min {
      display: none;
    }
    &.app-window-max {
      display: block;
      top: 0;
      right: 0;
      bottom: 42px;
      left: 0;
    }

    .app-window-header {
      position: absolute;
      top: 0;
      z-index: 600;
      display: inline-block;
      /*position: relative;*/
      width: 100%;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #0E2E49;
      background: #ffffff;

      .window-drag {
        position: absolute;
        left: 0;
        right: 96px;
        height: 100%;
      }
      .window-title {
        text-align: left;
        margin-left: 15px;
      }
      .window-bar {
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        margin: 0 15px;
        text-align: right;

        .window-bar-item {
          display: inline-block;
          width: 20px;
          height: 20px;
          text-align: center;
          vertical-align: top;
          &:hover {
            color: #2d8cf0;
          }
        }
      }
    }
    .app-window-body {
      position: absolute;
      top: 30px;
      bottom: 0;
      z-index: 600;
      overflow: auto;
      width: 100%;
      padding: 10px;
    }
  }
</style>

<template>
  <div
    class="app-window"
    :class="windowSizeClass"
    @click.stop="triggerWindow"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div class="app-window-header">
      <div class="window-title">{{ info.app.title }}</div>
      <div class="window-bar">
        <!-- 最小化 -->
        <div
          v-if="info.window.enableResize.includes('min')"
          class="window-bar-item"
          @click.stop.prevent="handleModalStatus('min')"
        >
          <Icon type="minus"></Icon>
        </div>
        <!-- 最大化 -->
        <div
          v-if="info.window.enableResize.includes('max') && info.window.size !== 'max'"
          class="window-bar-item"
          @click.stop.prevent="handleModalStatus('max')"
        >
          <Icon type="android-checkbox-outline-blank"></Icon>
        </div>
        <!-- 还原 -->
        <div
          v-if="info.window.enableResize.includes('reset') && info.window.size === 'max'"
          class="window-bar-item"
          @click.stop.prevent="handleModalStatus('reset')"
        >
          <Icon type="ios-browsers-outline"></Icon>
        </div>
        <!-- 关闭 -->
        <div
          v-if="info.window.enableResize.includes('close')"
          class="window-bar-item"
          @click.stop.prevent="handleModalStatus('close')"
        >
          <Icon type="close"></Icon>
        </div>
      </div>
    </div>
    <div class="app-window-body">
      <WinModal v-if="info.window.type && info.window.type === 'modal'" :info="info"></WinModal>
      <WinIFrame v-if="info.window.type && info.window.type === 'iframe'" :info="info"></WinIFrame>
    </div>
  </div>
</template>

<script>
  import WinIFrame from './components/WinIFrame.vue'
  import WinModal from './components/WinModal.vue'
  export default {
    name: 'Window',
    components: {
      WinIFrame,
      WinModal
    },
    props: {
      info: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        windowList: []
      }
    },
    computed: {
      windowSizeClass: function () {
        let _t = this
        let tmpClassName = ''
        switch (_t.info.window.size) {
          case 'custom':
            tmpClassName = 'app-window-custom'
            break
          case 'small':
            tmpClassName = 'app-window-small'
            break
          case 'middle':
            tmpClassName = 'app-window-middle'
            break
          case 'min':
            tmpClassName = 'app-window-min'
            break
          case 'max':
            tmpClassName = 'app-window-max'
            break
        }
        return tmpClassName
      }
    },
    methods: {
      // 处理弹窗状态
      handleModalStatus: function (actionName = 'close') {
        console.log('actionName', actionName)
        let _t = this
        let tmpInfo
        let appInfo = _t.info
        let currentSize = appInfo.window.size
        let currentStyle = appInfo.window.style
        let oldSize = appInfo.window.oldSize || 'middle'
        let oldStyle = appInfo.window.oldStyle || {}
        // 备份
        appInfo.window.oldSize = currentSize
        appInfo.window.oldStyle = currentStyle
        switch (actionName) {
          case 'min':
            appInfo.window.size = 'min'
            appInfo.window.style = {}
            break
          case 'reset':
            appInfo.window.size = oldSize
            appInfo.window.style = oldStyle
            break
          case 'max':
            appInfo.window.size = 'max'
            appInfo.window.style = {}
            break
          case 'close':
            appInfo.window.status = 'close'
            break
        }
        if (!tmpInfo) {
          return
        }
      },
      // 处理拖拽
      handleDragStart: function (event) {
        let _t = this
        let appInfo = _t.info
        // 判断当前窗口大小
        if (appInfo.window.size === 'max') {
          _t.handleModalStatus('reset')
        }
        // 鼠标点击位置相对拖拽对象位置
        let offsetX = event.offsetX
        let offsetY = event.offsetY
        // 拖拽对象数据
        let targetInfo = {
          target: 'Window',
          data: {
            id: appInfo.app.id,
            title: appInfo.app.title,
            name: appInfo.app.name,
            modalKey: '',
            offsetX: offsetX,
            offsetY: offsetY
          }
        }
        event.dataTransfer.setData('Text', JSON.stringify(targetInfo))
      },
      triggerWindow: function () {
        console.log('change Window z-index')
      }
    },
    created: function () {
      let _t = this
      // 监听事件
      _t.$utils.bus.$on('platform/window/open', function (val) {
        console.log('platform/window/open', val)
        _t.windowList.push(val)
      })
    }
  }
</script>
