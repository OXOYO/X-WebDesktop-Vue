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
    /*border: 1px solid #fff;*/
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, .1);
    writing-mode: horizontal-tb;
    transition: all .3s ease-out;

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

    .wallpaper-image {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(255, 255, 255, .1);
      filter: blur(20px);
      margin: -30px;
      z-index: -1;
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
      /*border-bottom: 1px solid #0E2E49;*/
      /*background: #ffffff;*/

      .window-drag {
        position: absolute;
        left: 0;
        right: 96px;
        height: 100%;
      }
      .window-title {
        text-align: left;
        margin-left: 15px;
        cursor: default;
        color: #ffffff;
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
          color: #ffffff;

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
      /*overflow: auto;*/
      width: 100%;
      padding: 8px;
      /*background: #fff;*/
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
    <div v-if="enableResizeHandler('top-left')" class="app-window-resize resize-top-left"></div>
    <div v-if="enableResizeHandler('top-right')" class="app-window-resize resize-top-right"></div>
    <div v-if="enableResizeHandler('bottom-left')" class="app-window-resize resize-bottom-left"></div>
    <div v-if="enableResizeHandler('bottom-right')" class="app-window-resize resize-bottom-right"></div>
    <div v-if="enableResizeHandler('top-border')" class="app-window-resize resize-top-border"></div>
    <div v-if="enableResizeHandler('right-border')" class="app-window-resize resize-right-border"></div>
    <div v-if="enableResizeHandler('bottom-border')" class="app-window-resize resize-bottom-border"></div>
    <div v-if="enableResizeHandler('left-border')" class="app-window-resize resize-left-border"></div>
    <div
      class="wallpaper-image"
      :style="currentWallpaper.type === 'images' ? currentWallpaper.style : ''"
    >
    </div>
    <div
      class="app-window-header"
    >
      <!--
      // FIXME 测试header自定义功能
      v-if="!(info.window.header && !info.window.header.enable)"
      -->
      <div
        class="window-title"
        @mousedown.stop="onWindowMouseDown"
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
        // 拖拽缩放默认配置
        defDragResizeConfig: {
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
              // FIXME 支持自定义缩放handler，如果不启用则值给 false，如果启用则值给 具体的class名称
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
      ...mapState('Platform/Wallpaper', {
        currentWallpaper: state => state.currentWallpaper
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
      // 拖拽缩放配置
      dragResizeConfig: function () {
        let _t = this
        return _t.handleDragResizeConfig()
      }
    },
    methods: {
      // 处理窗口拖拽缩放配置
      handleDragResizeConfig: function () {
        let _t = this
        console.log('_t.info', _t.info)
        // 当前应用的拖拽缩放配置
        let appDragResizeConfig = _t.info.window.hasOwnProperty('dragResizeConfig') ? _t.info.window.dragResizeConfig : {}
        // 合并配置，遇到对象则合并，其他覆盖
        let handler = function (source, target) {
          let keys = Object.keys(source)
          // 1.判断源对象是否需要处理
          if (keys.length) {
            keys.map(key => {
              // 源属性
              let item = source[key]
              // 1.1.target是否存在该属性，有则做处理，无则跳过
              let flag = target.hasOwnProperty(key)
              if (flag) {
                // 1.1.1.判断类型是否相等，同类型才可以执行覆盖
                if (typeof item === typeof target[key]) {
                  // 1.2.不是对象则覆盖、是数组则覆盖
                  if (typeof item !== 'object' || (typeof item === 'object' && item instanceof Array)) {
                    source[key] = target[key]
                    // 1.3.是对象则递归处理
                  } else if (typeof item === 'object' && typeof target === 'object') {
                    source[key] = handler(item, target[key])
                  }
                }
              }
            })
          }
          return source
        }
        let tmpObj = handler(_t.defDragResizeConfig, appDragResizeConfig)
        return tmpObj
      },
      // 处理缩放handler
      enableResizeHandler: function (direction) {
        let _t = this
        let flag = false
        if (_t.dragResizeConfig && _t.dragResizeConfig.resize.enable && _t.dragResizeConfig.resize.handler) {
          flag = !!_t.dragResizeConfig.resize.handler[direction]
        }
        return flag
      },
      // 处理弹窗状态
      handleWindowSize: function (actionName = 'close') {
        let _t = this
        let appInfo = {..._t.info}
        // 如果未启用相应则返回
        if (!appInfo.window.enableResize.includes(actionName)) {
          return false
        }
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
      },
      onWindowMouseDown: function () {
        let _t = this
        console.log('change Window zIndex', _t.info.window.zIndex)
        // 广播事件 触发window事件
        let appInfo = {..._t.info}
        _t.$utils.bus.$emit('platform/window/trigger', {
          // 通过窗口控制按钮缩放窗口
          action: 'zIndexChangeByWindow',
          data: {
            appInfo: appInfo
          }
        })
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
      }
    }
  }
</script>
