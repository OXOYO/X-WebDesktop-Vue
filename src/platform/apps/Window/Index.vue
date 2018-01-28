/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-window {
    display: inline-block;
    position: absolute;
    /*left: 50%;*/
    /*top: 50%;*/
    /*z-index: 2000;*/
    overflow: hidden;
    background: #fff;
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, .1);
    writing-mode: horizontal-tb;
    transition: all .5s ease-out;

    &.app-window-small {
      /*
      width: 300px;
      height: 200px;
      left: 50%;
      top: 50%;
      margin-left: -150px;
      margin-top: -100px;
      */
    }
    &.app-window-middle {
      /*
      width: 800px;
      height: 600px;
      left: 50%;
      top: 50%;
      margin-left: -400px;
      margin-top: -300px;
      */
    }
    &.app-window-min {
      /*
      width: 0;
      height: 0;
      top: 100%;
      */
    }
    &.app-window-max {
      /*
      display: block;
      top: 0;
      right: 0;
      bottom: 42px;
      left: 0;
      */
    }

    &.app-window-drag-start,
    &.app-window-drag-move {
      transition: none;
      opacity: .7;
    }

    .app-window-resize {
      width: 20px;
      height: 20px;
      position: absolute;
      background: transparent;
      z-index: 2010;
      &.resize-top-left {
        cursor: nw-resize;
        top: 0;
        left: 0;
      }
      &.resize-top-right {
        cursor: ne-resize;
        top: 0;
        right: 0;
      }
      &.resize-bottom-left {
        cursor: sw-resize;
        bottom: 0;
        left: 0;
      }
      &.resize-bottom-right {
        cursor: se-resize;
        bottom: 0;
        right: 0;
      }
      &.resize-top-border {
        cursor: ns-resize;
        top: 0;
        width: 100%;
        height: 2px;
      }
      &.resize-right-border {
        cursor: ew-resize;
        right: 0;
        width: 2px;
        height: 100%;
      }
      &.resize-bottom-border {
        cursor: ns-resize;
        bottom: 0;
        width: 100%;
        height: 2px;
      }
      &.resize-left-border {
        cursor: ew-resize;
        left: 0;
        width: 2px;
        height: 100%;
      }
    }

    .app-window-header {
      position: absolute;
      top: 0;
      z-index: 2000;
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
      z-index: 2000;
      overflow: auto;
      width: 100%;
      /*padding: 10px;*/
    }
  }
  .x-drag,
  .x-drag-start,
  .x-drag-move {
    transition: none;
    opacity: .7;
    /*transform: translateZ(0);*/
  }
</style>

<template>
  <div
    class="app-window"
    :class="windowSizeClass"
    @mousedown.stop="onWindowMouseDown"
    :window-name="info.app.name"
    :style="info.window.style"
    v-x-drag="dragResizeConfig"
  >
    <!-- 拖拽缩放 -->
    <div class="app-window-resize resize-top-left"></div>
    <div class="app-window-resize resize-top-right"></div>
    <div class="app-window-resize resize-bottom-left"></div>
    <div class="app-window-resize resize-bottom-right"></div>
    <div class="app-window-resize resize-top-border"></div>
    <div class="app-window-resize resize-right-border"></div>
    <div class="app-window-resize resize-bottom-border"></div>
    <div class="app-window-resize resize-left-border"></div>
    <div
      class="app-window-header"
    >
      <div
        class="window-title"
        @dblclick.stop.prevent="handleWindowSize(info.window.size === 'max' ? 'reset' : 'max')"
      >
        {{ info.app.title }}
      </div>
      <div class="window-bar">
        <!-- 最小化 -->
        <div
          v-if="info.window.enableResize.includes('min')"
          class="window-bar-item"
          @mousedown.stop
          @mousemove.stop
          @mouseup.stop
          @click.stop.prevent="handleWindowSize('min')"
        >
          <Icon type="minus"></Icon>
        </div>
        <!-- 最大化 -->
        <div
          v-if="info.window.enableResize.includes('max') && info.window.size !== 'max'"
          class="window-bar-item"
          @mousedown.stop
          @mousemove.stop
          @mouseup.stop
          @click.stop.prevent="handleWindowSize('max')"
        >
          <Icon type="android-checkbox-outline-blank"></Icon>
        </div>
        <!-- 还原 -->
        <div
          v-if="info.window.enableResize.includes('reset') && info.window.size === 'max'"
          class="window-bar-item"
          @mousedown.stop
          @mousemove.stop
          @mouseup.stop
          @click.stop.prevent="handleWindowSize('reset')"
        >
          <Icon type="ios-browsers-outline"></Icon>
        </div>
        <!-- 关闭 -->
        <div
          v-if="info.window.enableResize.includes('close')"
          class="window-bar-item"
          @mousedown.stop
          @mousemove.stop
          @mouseup.stop
          @click.stop.prevent="handleWindowSize('close')"
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
  import { mapState } from 'vuex'
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
      let _t = this
      return {
        // 预览样式
        previewStyle: {},
        // 预览当前窗口样式
        previewCurrentStyle: {},
        // 拖拽缩放配置
        dragResizeConfig: {
          // 上下文，如需广播事件则必须
          context: _t,
          // 拖拽配置
          drag: {
            // 是否启用拖拽
            enable: true,
            // 指定拖拽把手元素，支持一个或多个把手
            handler: ['.window-title'],
            // 拖拽不同阶段 className
            class: {
              start: 'x-drag-start',
              move: 'x-drag-move',
              done: 'x-drag-done',
              main: 'x-drag'
            },
            // 回调
            callback: {
              start: null,
              move: null,
              done: _t.handleDragResizeDone
            }
          },
          // 缩放配置
          resize: {
            // 是否启用缩放
            enable: true,
            // 指定缩放把手元素，支持一个或多个把手
            handler: {
              'top-left': '.resize-top-left',
              'top-right': '.resize-top-right',
              'bottom-left': '.resize-bottom-left',
              'bottom-right': '.resize-bottom-right',
              'top-border': '.resize-top-border',
              'right-border': '.resize-right-border',
              'bottom-border': '.resize-bottom-border',
              'left-border': '.resize-left-border'
            },
            // 缩放不同阶段 className
            class: {
              start: 'x-resize-start',
              move: 'x-resize-move',
              done: 'x-resize-done',
              main: 'x-resize'
            },
            // 回调
            callback: {
              start: null,
              move: null,
              done: _t.handleDragResizeDone
            }
          }
        },
        // 通过行内样式控制
        windowStyleBySize: {
          small: {
            width: '300px',
            height: '200px',
            left: 'calc(50% - 150px)',
            top: 'calc(50% - 100px)'
//            ,
//            'margin-left': '-150px',
//            'margin-top': '-100px'
          },
          middle: {
            width: '800px',
            height: '600px',
            left: 'calc(50% - 400px)',
            top: 'calc(50% - 300px)'
//            ,
//            'margin-left': '-400px',
//            'margin-top': '-300px'
          },
          max: {
            left: 0,
            top: 0,
            right: 0,
            bottom: '42px'
          },
          min: {
            width: 0,
            height: 0,
            top: '100%'
          }
        }
      }
    },
    computed: {
      ...mapState('Platform/Admin', {
        _appData: state => state._appData
      }),
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
      },
      windowStyle: function () {
        let _t = this
        let windowStyleBySize = _t.windowStyleBySize[_t.info.window.size] || {}
        let tmpObj = windowStyleBySize
        console.log('_t.previewStyle', tmpObj, _t.previewStyle, _t.previewCurrentStyle)
        if (Object.keys(_t.previewStyle).length) {
          tmpObj = {
            ...tmpObj,
            ..._t.info.window.style,
            ..._t.previewStyle
          }
        } else if (Object.keys(_t.previewCurrentStyle).length) {
          tmpObj = {
            ...tmpObj,
            ..._t.info.window.style,
            ..._t.previewCurrentStyle
          }
        } else {
          tmpObj = {
            ...tmpObj,
            ..._t.info.window.style
          }
        }
        console.log('windowStyle', _t.info.app.name, tmpObj, tmpObj['z-index'])
        return tmpObj
      }
    },
    methods: {
      // 处理弹窗状态
      handleWindowSize: function (actionName = 'close') {
        let _t = this
//        let tmpInfo
        let appInfo = {..._t.info}
        let currentSize = appInfo.window.size
        let currentStyle = appInfo.window.style
        let oldSize = appInfo.window.oldSize || 'middle'
        let oldStyle = appInfo.window.oldStyle || {}
        // 查找备份数据
        let _appData = JSON.parse(JSON.stringify(_t._appData))
        let _appInfo
        for (let i = 0, len = _appData.iconList.length; i < len; i++) {
          let item = _appData.iconList[i]
          if (item.app.name === appInfo.app.name) {
            _appInfo = item
          }
        }
        // 备份
//        appInfo.window.oldSize = currentSize
//        appInfo.window.oldStyle = currentStyle
        let tmpObj = {
          appInfo: appInfo,
          actionName: actionName,
          newSize: '',
          oldSize: '',
          newStyle: '',
          oldStyle: '',
          status: ''
        }
        // 备份
        tmpObj['oldSize'] = currentSize
        tmpObj['oldStyle'] = currentStyle
        switch (actionName) {
          case 'min':
//            appInfo.window.size = 'min'
//            appInfo.window.style = {}
            tmpObj['newSize'] = 'min'
            tmpObj['newStyle'] = {}
            tmpObj['status'] = 'open'
            break
          case 'reset':
//            appInfo.window.size = oldSize
//            appInfo.window.style = oldStyle
            tmpObj['newSize'] = oldSize
            tmpObj['newStyle'] = oldStyle
            tmpObj['status'] = 'open'
            break
          case 'max':
//            appInfo.window.size = 'max'
//            appInfo.window.style = {}
            tmpObj['newSize'] = 'max'
            tmpObj['newStyle'] = {}
            tmpObj['status'] = 'open'
            break
          case 'close':
//            appInfo.window.status = 'close'
            tmpObj['oldSize'] = ''
            tmpObj['oldStyle'] = {}
            tmpObj['newSize'] = _appInfo.window.size
            tmpObj['newStyle'] = _appInfo.window.style
            tmpObj['status'] = 'close'
            break
        }
//        console.log('appInfo.window.size', appInfo.window.size, _t.info.window.size)
//        if (!tmpInfo) {
//          return
//        }
        // 广播事件 触发window事件
        _t.$utils.bus.$emit('platform/window/trigger', {
          // 通过窗口控制按钮缩放窗口
          action: 'resizeByWindowBar',
          data: {
            appInfo: appInfo,
            action: actionName
          }
        })
//        _t.$utils.bus.$emit('platform/window/size/change', tmpObj)
//        // 如果是最小化
//        if (actionName === 'min') {
//          tmpObj['newStyle'] = {
//            'display': 'none'
//          }
//          setTimeout(function () {
//            _t.$utils.bus.$emit('platform/window/size/change', tmpObj)
//          }, 300)
//        }
      },
      onWindowMouseDown: function () {
        let _t = this
//        console.log('change Window zIndex', _t.info.window.zIndex)
        // 广播事件 触发window事件
        let appInfo = {..._t.info}
        _t.$utils.bus.$emit('platform/window/trigger', {
          // 通过窗口控制按钮缩放窗口
          action: 'zIndexChangeByWindow',
          data: {
            appInfo: appInfo
          }
        })
//        _t.$utils.bus.$emit('platform/window/preview/clear')
//        _t.$nextTick(function () {
//          let appInfo = {..._t.info}
//          _t.$utils.bus.$emit('platform/window/zIndex/change', appInfo)
//        })
      },
      // 处理窗口预览
      handleWindowPreviewOpen: function () {
        let _t = this
        console.log('_t.previewStyle handleWindowPreviewOpen', Object.keys(_t.previewStyle))
        _t.previewStyle = {
          'z-index': '-1',
          position: 'absolute',
          display: 'inline-block',
          left: '50%',
          top: '50%',
          width: '800px',
          height: '600px',
          'margin-left': '-400px',
          'margin-top': '-300px'
        }
        _t.handleWindowStyle()
        _t.$nextTick(function () {
          let appInfo = {..._t.info}
          console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
          _t.$utils.bus.$emit('platform/window/preview/open/done/' + appInfo.app.name, appInfo)
        })
      },
      handleWindowPreviewClose: function () {
        let _t = this
        _t.previewStyle = {}
        _t.handleWindowStyle()
      },
      handleWindowPreviewCurrentOpen: function () {
        let _t = this
        _t.previewStyle = {}
        if (_t.info.window.size === 'min') {
          console.log('Object.keys(_t.info.window.oldStyle).length', Object.keys(_t.info.window.oldStyle).length)
          if (Object.keys(_t.info.window.oldStyle).length) {
            _t.previewCurrentStyle = {
              ..._t.info.window.oldStyle,
              display: 'inline-block'
            }
          } else {
            _t.previewCurrentStyle = {
              'z-index': 2000,
              position: 'absolute',
              display: 'inline-block',
              left: '50%',
              top: '50%',
              width: '800px',
              height: '600px',
              'margin-left': '-400px',
              'margin-top': '-300px'
            }
          }
        }
        _t.handleWindowStyle()
      },
      handleWindowPreviewOtherClose: function () {
        let _t = this
        _t.previewStyle = {}
        _t.previewCurrentStyle = {
          'z-index': -1
        }
        _t.handleWindowStyle()
      },
      handleWindowPreviewCurrentClose: function () {
        let _t = this
        _t.previewStyle = {}
        _t.previewCurrentStyle = {}
        _t.handleWindowStyle()
      },
      handleWindowPreviewOtherOpen: function () {
        let _t = this
        _t.previewStyle = {}
        _t.previewCurrentStyle = {}
        _t.handleWindowStyle()
      },
      // 拖拽完成回调
      handleDragResizeDone: function (style) {
        let _t = this
//        console.log('drag resize style', style)
        // 分发mutations，更新窗口样式
        let appInfo = {..._t.info}
        appInfo['window']['style'] = {
          ...appInfo['window']['style'],
          ...style
        }
        // 广播事件 触发window事件
        _t.$utils.bus.$emit('platform/window/trigger', {
          // 通过XDrag控制窗口拖拽、缩放
          action: 'dragResize',
          data: {
            appInfo: appInfo
          }
        })
//        _t.$utils.bus.$emit('platform/window/style/change', appInfo)
      },
      handleWindowStyle: function () {
        let _t = this
        _t.windowStyle = {}
        _t.$nextTick(function () {
          let windowStyleBySize = _t.windowStyleBySize[_t.info.window.size] || {}
          let tmpObj = windowStyleBySize
//          let tmpObj = {}
          console.log('_t.previewStyle handleWindowStyle', tmpObj, _t.previewStyle, Object.keys(_t.previewStyle).length, _t.previewCurrentStyle, Object.keys(_t.previewCurrentStyle).length)
          if (Object.keys(_t.previewStyle).length) {
            console.log('xxx 001')
            tmpObj = {
              ...tmpObj,
              ..._t.info.window.style,
              ..._t.previewStyle
            }
          } else if (Object.keys(_t.previewCurrentStyle).length) {
            console.log('xxx 002')
            tmpObj = {
              ...tmpObj,
              ..._t.info.window.style,
              ..._t.previewCurrentStyle
            }
          } else {
            console.log('xxx 003')
            tmpObj = {
              ...tmpObj,
              ..._t.info.window.oldStyle
            }
          }
          console.log('windowStyle handleWindowStyle', _t.info.app.name, tmpObj, tmpObj['z-index'])
          // _t.windowStyle = tmpObj
          let appInfo = {..._t.info}
          appInfo['window']['style'] = {
//            ...appInfo['window']['style'],
            ...tmpObj
          }
          _t.$utils.bus.$emit('platform/window/style/change', appInfo)
        })
      }
    },
    created: function () {
      let _t = this
      let appName = _t.info.app.name
      // 监听 window 预览
      _t.$utils.bus.$on('platform/window/preview/open/' + appName, function (appInfo) {
        if (appInfo && appInfo.app.name === _t.info.app.name) {
          // 处理窗口预览
          _t.handleWindowPreviewOpen(appInfo)
        }
      })
      _t.$utils.bus.$on('platform/window/preview/close/' + appName, function (appInfo) {
        if (appInfo && appInfo.app.name === _t.info.app.name) {
          // 处理窗口预览
          _t.handleWindowPreviewClose(appInfo)
        }
      })
      _t.$utils.bus.$on('platform/window/preview/current/open/' + appName, function (appInfo) {
        if (appInfo && appInfo.app.name === _t.info.app.name) {
          // 处理窗口预览
          _t.handleWindowPreviewCurrentOpen(appInfo)
        } else {
          // 处理其他窗口预览
          _t.handleWindowPreviewOtherClose()
        }
      })
      _t.$utils.bus.$on('platform/window/preview/current/close/' + appName, function (tmpInfo) {
        let {appInfo, needDone} = tmpInfo
        if (appInfo && appInfo.app.name === _t.info.app.name) {
          // 处理窗口预览
          _t.handleWindowPreviewCurrentClose(appInfo)
          if (needDone) {
            _t.$nextTick(function () {
              let appInfo = {..._t.info}
              _t.$utils.bus.$emit('platform/window/preview/current/close/done/' + appInfo.app.name, appInfo)
            })
          }
        } else {
          // 处理其他窗口预览
          _t.handleWindowPreviewOtherOpen()
        }
      })
    },
    beforeDestroy: function () {
      let _t = this
      let appName = _t.info.app.name
      _t.$utils.bus.$off([
        'platform/window/preview/open/' + appName,
        'platform/window/preview/close/' + appName,
        'platform/window/preview/current/open/' + appName,
        'platform/window/preview/current/close/' + appName
      ])
    }
  }
</script>
