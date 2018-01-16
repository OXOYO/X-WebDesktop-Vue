/**
* Created by OXOYO on 2017/12/26.
*
*/

<style lang="less" rel="stylesheet/less">
  .task-bar-icon {
    display: inline-block;
    width: 60px;
    height: 39px;
    margin: 0 4px;
    position: relative;
    user-select:none;
    &.task-bar-icon-pinned {
    }

    .task-bar-preview {
      position: absolute;
      bottom: 40px;
      left: 50%;
      height: 150px;
      width: 215px;
      padding: 10px;
      margin-left: -107px;
      /*border: 1px solid #f5f7f9;*/
      /*background: rgba(245, 247, 249, .3);*/
      background: rgba(0, 0, 0, .3);
      z-index: 5030;
      box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, .5);
      transition: all .2s ease-out;

      .preview-header {
        width: 100%;
        height: 25px;
        line-height: 25px;
        overflow: hidden;
        color: #fff;
      }
      .preview-body {
        width: 100%;
        height: 105px;
        overflow: hidden;
        text-align: center;

        canvas,
        img {
          margin: 0 auto;
          width: auto !important;
          height: 100% !important;
        }
      }
    }
    .task-bar-icon-main{
      width: 60px;
      height: 39px;
      line-height: 39px;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: all .2s ease-out;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 10;
        background: transparent;
      }
      &.app-open {
        /*border: 1px solid rgba(0, 0, 0, .3);*/
        /*background: rgba(250, 253, 255, .3);*/
        border-radius: 2px;
        /*box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);*/
        box-shadow: 0 0 1px 1px rgba(0, 0, 0, .2);
        &:after {
          content: ' ';
          position: absolute;
          z-index: -1;
          /*background: red;*/
          /*background: rgba(250, 253, 255, .5);*/
          background: rgba(255, 255, 255, 0.3);
          /*opacity: .5;*/
          filter: blur(5px);
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
      }
      &:hover {
        &:after {
          content: ' ';
          position: absolute;
          z-index: -1;
          /*background: red;*/
          /*background: rgba(250, 253, 255, .5);*/
          background: rgba(255, 255, 255, 0.3);
          /*opacity: .5;*/
          filter: blur(10px);
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
        &.app-open {
          box-shadow: 0 0 1px 1px rgba(0, 0, 0, .3);
        }
        .app-icon-bg {
          display: block !important;
          filter: blur(6px);
        }
      }
    }
    .app-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -15px;
      margin-top: -15px;
      width: 30px;
      height: 30px;
      /*filter: drop-shadow(0 0 10px #ccc);*/
      /*background: hsla(0,0%,100%,.25) border-box;*/
      /*box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);*/
    }
    .app-icon-down {
      margin-left: -14px;
      margin-top: -14px;
    }
    .app-icon-bg {
      position: absolute;
      display: block;
      overflow: hidden;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      filter: blur(50px);
      background-position: center top;
      transition: all .2s ease-out;
      /*background-size: cover;*/
      /*background-attachment: fixed;*/
    }
  }
</style>

<template>
  <div
    v-if="info.window.status === 'open' || info.taskBar.isPinned"
    class="task-bar-icon"
    :class="{ 'task-bar-icon-pinned': info.taskBar.isPinned }"
    @mousedown.left.stop.prevent="handlerMouseDown"
    @mouseup.left.stop.prevent="handlerMouseUp"
    @contextmenu.stop.prevent="handlerRightClick($event)"
    @mouseenter="handleMouseOver"
    @mouseleave="handleMouseOut"
    :title="info.app.title"
    :data-name="info.app.name"
  >
    <!-- 预览图 -->
    <div class="task-bar-preview"
      v-show="previewImg"
      @mouseup.left.stop.prevent="handlerMouseUp"
    >
      <div class="preview-header">{{ info.app.title }}</div>
      <!--<div class="preview-body" :preview-window="info.app.name"></div>-->
      <div class="preview-body">
        <img :src="previewImg" alt="info.app.name">
      </div>
    </div>
    <!-- 图标 -->
    <div class="task-bar-icon-main" :class="{ 'app-open': info.window.status === 'open' }" :data-name="info.app.name">
      <img class="app-icon" :class="{ 'app-icon-down': isMouseDown}" v-if="info.app.icon" :src="info.app.icon" :data-name="info.app.name">
      <div class="app-icon-bg" v-show="info.app.icon && info.window.status === 'open'" :style="appIconBg"></div>
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
//  import domtoimage from 'dom-to-image'

  export default {
    name: 'TaskBarIcon',
    props: {
      info: {
        type: Object,
        default: function () {
          return {}
        },
        required: true
      },
      type: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        isMouseDown: false,
        previewImg: null,
        targetWindow: null
      }
    },
    computed: {
      appIconBg: function () {
        let _t = this
        let icon = _t.info.app.hasOwnProperty('icon') && _t.info.app.icon ? _t.info.app.icon : null
        if (!icon) {
          return {}
        }
//        console.log('icon', icon)
//        let img = require(icon)
        let img = icon
        return {
          backgroundImage: 'url(' + img + ')'
        }
      }
    },
    methods: {
      // 鼠标按下
      handlerMouseDown: function () {
        let _t = this
        _t.isMouseDown = true
      },
      // 鼠标抬起
      handlerMouseUp: function () {
        let _t = this
        _t.isMouseDown = false
        // 打开应用
        let appInfo = {..._t.info}
        // 清空预览图
        _t.previewImg = null
        _t.targetWindow = null
        // 清除预览窗口样式
        _t.$utils.bus.$emit('platform/window/preview/close', appInfo)
        /*
        // 判断应用是否已打开
        if (appInfo.window.status === 'open') {
          let tmpObj = {
            appInfo: appInfo,
            actionName: '',
            newSize: '',
            oldSize: '',
            newStyle: '',
            oldStyle: '',
            status: ''
          }
          let currentSize = appInfo.window.size
          let currentStyle = appInfo.window.style
          let oldSize = appInfo.window.oldSize || 'middle'
          let oldStyle = appInfo.window.oldStyle || {}
          // 判断当前窗口是否为最小化
          if (appInfo.window.size === 'min') {
            // 更新
            tmpObj['actionName'] = 'reset'
            tmpObj['oldSize'] = currentSize
            tmpObj['oldStyle'] = currentStyle
            tmpObj['newSize'] = oldSize
            tmpObj['newStyle'] = oldStyle
            tmpObj['status'] = 'open'
          } else {
            // 更新
            tmpObj['actionName'] = 'min'
            tmpObj['oldSize'] = currentSize
            tmpObj['oldStyle'] = currentStyle
            tmpObj['newSize'] = 'min'
            tmpObj['newStyle'] = {}
            tmpObj['status'] = 'open'
          }
          _t.$utils.bus.$emit('platform/window/size/change', tmpObj)
        } else if (appInfo.window.status === 'close') {

        }
        */
        _t.$nextTick(function () {
          _t.$utils.bus.$emit('platform/window/toggle', appInfo)
        })
      },
      // 右键菜单
      handlerRightClick: function (event) {
        let _t = this
        let appInfo = {..._t.info}
        // 清空预览图
        _t.previewImg = null
        _t.targetWindow = null
        // 清除预览窗口样式
        _t.$utils.bus.$emit('platform/window/preview/close', appInfo)
        _t.$nextTick(function () {
          console.log('event', event)
          let xVal = parseInt(event.clientX) - parseInt(event.offsetX)
          let yVal = parseInt(event.clientY) - parseInt(event.offsetY)
          let appName = event.target.dataset['name'] || _t.info.app.name || null
          // 菜单信息
          let contextMenuInfo = {
            isShow: true,
            x: xVal,
            y: yVal,
            target: 'taskBarIcon-' + _t.type,
            appName: appName,
            data: {
              ..._t.info
            },
            list: [
              {
                name: 'refresh',
                icon: {
                  type: 'refresh',
                  style: ''
                },
                text: '刷新',
                enable: true,
                action: {
                  type: 'bus',
                  handler: 'platform/refresh'
                }
              },
              {
                name: 'fullScreen',
                icon: {
                  type: 'arrow-expand',
                  style: ''
                },
                text: '全屏',
                enable: true,
                action: {
                  type: 'bus',
                  handler: 'platform/fullScreen/open'
                }
              },
              {
                name: 'cancelFullScreen',
                icon: {
                  type: 'arrow-shrink',
                  style: ''
                },
                text: '取消全屏',
                enable: true,
                action: {
                  type: 'bus',
                  handler: 'platform/fullScreen/close'
                }
              },
              {
                name: 'wallpaper',
                icon: {
                  type: '',
                  style: ''
                },
                text: '切换壁纸',
                enable: true,
                action: {
                  type: 'bus',
                  handler: 'platform/wallpaper/switch'
                }
              },
              {
                name: 'openApp',
                icon: {
                  type: '',
                  style: ''
                },
                text: '打开',
                enable: true,
                action: {
                  type: 'bus',
                  handler: 'platform/app/open'
                }
              },
              {
                name: 'openAppInNewBrowserTab',
                icon: {
                  type: '',
                  style: ''
                },
                text: '在新标签页中打开',
                enable: _t.info.window.type === 'iframe' && _t.info.app.url,
                action: {
                  type: 'bus',
                  handler: 'platform/app/openInNewBrowserTab'
                }
              },
              {
                name: 'uninstallApp',
                icon: {
                  type: '',
                  style: ''
                },
                text: '卸载',
                enable: true,
                action: {
                  type: 'bus',
                  handler: 'platform/app/uninstall'
                }
              },
              {
                name: 'pinToTaskBar',
                icon: {
                  type: '',
                  style: {
                    transform: 'rotate(90deg)'
                  }
                },
                text: '将此程序锁定到任务栏',
                enable: !_t.info.taskBar.isPinned,
                action: {
                  type: 'bus',
                  handler: 'platform/taskBar/pin'
                }
              },
              {
                name: 'unpinToTaskBar',
                icon: {
                  type: '',
                  style: ''
                },
                text: '将此程序从任务栏解锁',
                enable: _t.info.taskBar.isPinned,
                action: {
                  type: 'bus',
                  handler: 'platform/taskBar/unpin'
                }
              },
              {
                name: 'closeApp',
                icon: {
                  type: '',
                  style: ''
                },
                text: '关闭',
                enable: true,
                action: {
                  type: 'bus',
                  handler: 'platform/app/close'
                }
              }
            ]
          }
          console.log('contextMenuInfo', contextMenuInfo)
          // 广播事件
          _t.$utils.bus.$emit('platform/contextMenu/show', contextMenuInfo)
        })
      },
      // 处理鼠标移上事件
      handleMouseOver: function () {
        let _t = this
        let appInfo = {..._t.info}
//        // 清空预览图
//        _t.previewImg = null
//        // 清除预览窗口样式
//        _t.$utils.bus.$emit('platform/window/preview/close', appInfo)
//        _t.$nextTick(function () {
//          setTimeout(function () {
          // 判断应用是否打开
        if (appInfo.window.status !== 'open') {
          return
        }
        let targetWindow
        // if (appInfo.window.type === 'iframe') {
        // targetWindow = document.querySelector('[window-name=' + appInfo.app.name + '] iframe body')
        // } else if (appInfo.window.type === 'modal') {
        targetWindow = document.querySelector('[window-name=' + appInfo.app.name + ']')
        // }
        // 判断应用size，当size 为min时无法截图，需将窗口显示在浏览器窗口范围内
        if (appInfo.window.size === 'min') {
          console.log('targetWindow.style', targetWindow.style)
//          targetWindow.style.top = 0
          _t.$utils.bus.$emit('platform/window/preview/open', appInfo)
        }
        _t.tagetWindow = targetWindow
//        _t.$nextTick(function () {
        setTimeout(function () {
          console.log('targetWindow', targetWindow)
          html2canvas(targetWindow).then(function (canvas) {
            // console.log('canvas', canvas)
            _t.previewImg = canvas.toDataURL()
          }).catch(function (error) {
            console.error('html2canvas render error!', error)
          })
        }, 200)
//        })
  //        domtoimage.toPng(targetWindow).then(function (dataUrl) {
  //          console.log('dataUrl', dataUrl)
  //          _t.previewImg = dataUrl
  //        }).catch(function (error) {
  //          console.error('oops, something went wrong!', error)
  //        })
//          }, 1000)
//        })
      },
      // 处理鼠标移出事件
      handleMouseOut: function () {
        let _t = this
        _t.previewImg = null
        _t.targetWindow = null
        let appInfo = {..._t.info}
        _t.$utils.bus.$emit('platform/window/preview/close', appInfo)
      }
    },
    created: function () {
      let _t = this
      // 监听 window 预览
      _t.$utils.bus.$on('platform/window/preview/open/done', function (appInfo) {
        if (appInfo && appInfo.app.name === _t.info.app.name && _t.targetWindow) {
//          console.log('targetWindow', targetWindow)
          html2canvas(_t.targetWindow).then(function (canvas) {
            // console.log('canvas', canvas)
            _t.previewImg = canvas.toDataURL()
          }).catch(function (error) {
            console.error('html2canvas render error!', error)
          })
        }
      })
      // 清除预览
      _t.$utils.bus.$on('platform/window/preview/clear', function () {
        _t.previewImg = null
        _t.targetWindow = null
      })
    }
  }
</script>
