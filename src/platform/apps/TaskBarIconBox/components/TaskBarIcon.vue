/**
* Created by OXOYO on 2017/12/26.
*
*/

<style lang="less" rel="stylesheet/less">
  .task-bar-icon {
    display: inline-block;
    width: 60px;
    height: 39px;
    margin: 0 1px;
    position: relative;
    user-select: none;
    &.task-bar-icon-pinned {
    }

    .task-bar-preview {
      position: absolute;
      bottom: 40px;
      left: 50%;
      height: 150px;
      max-width: 215px;
      padding: 8px;
      margin-left: -50%;
      border: 1px solid rgba(245, 247, 249, .6);
      border-radius: 5px;
      /*background: rgba(245, 247, 249, .3);*/
      background: rgba(0, 0, 0, .3);
      z-index: 5030;
      box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, .5);
      transition: all .2s ease-out;

      .preview-body {
        width: 100%;
        height: 100%;
        padding: 2px 5px 10px;
        border: 1px solid transparent;
        border-radius: 4px;
        position: relative;

        .preview-bg {
          /*content: ' ';*/
          position: absolute;
          display: block;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: rgba(255, 255, 255, .2);
          filter: blur(25px);
          opacity: 0;
          overflow: hidden;
          z-index: -1;
          background: center top / cover no-repeat fixed;
        }

        &:hover {
          border-color: rgba(245, 247, 249, .5);

          .preview-bg {
            opacity: .3;
          }
        }

        .preview-title {
          width: 100%;
          height: 25px;
          line-height: 25px;
          overflow: hidden;
          color: #fff;
          /*background: red;*/
        }
        .preview-img {
          width: 100%;
          height: 90px;
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
          /*filter: blur(6px);*/
          .content {
            filter: blur(10px);
          }
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
      border-radius: 5px;
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
      /*filter: blur(50px);*/
      /*background-position: center top;*/
      transition: all .2s ease-out;
      /*background-size: cover;*/
      /*background-attachment: fixed;*/

      .content {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        filter: blur(50px);
        background-color: transparent;
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
      }
    }
  }
</style>

<template>
  <div
    v-if="info.config.window.status === 'open' || info.config.taskBar.isPinned"
    class="task-bar-icon"
    :class="{ 'task-bar-icon-pinned': info.config.taskBar.isPinned }"
    @mousedown.left.stop.prevent="onIconMouseDown"
    @mouseup.left.stop.prevent="onIconMouseUp"
    @contextmenu.stop.prevent="onIconRightClick($event)"
    @mouseenter.stop.prevent="onIconMouseOver"
    @mouseleave.stop.prevent="onIconMouseOut"
    :title="info.app_title || info.config.app.title"
    :data-name="info.app_name || info.config.app.name"
  >
    <!--
    @mouseenter.stop.prevent="onIconMouseOver"
    @mouseleave.stop.prevent="onIconMouseOut"
    -->
    <!-- 预览图 -->
    <div class="task-bar-preview"
      v-show="previewImg"
    >
      <div
        class="preview-body"
        @mousedown.left.stop.prevent
        @mouseup.left.stop.prevent="onPreviewMouseUp"
        @contextmenu.stop.prevent
      >
        <!--
        @mouseover.stop.prevent="onPreviewMouseOver"
        @mouseout.stop.prevent="onPreviewMouseOut"
        -->
        <!--<div class="preview-bg" :style="{ 'background-image': 'url('+ previewImg || '' + ')' }"></div>-->
        <div class="preview-title">{{ info.app_title || info.config.app.title }}</div>
        <div class="preview-img" v-if="previewImg">
          <img :src="previewImg">
        </div>
      </div>
    </div>
    <!-- 图标 -->
    <div class="task-bar-icon-main" :class="{ 'app-open': info.config.window.status === 'open' }" :data-name="info.app_name || info.config.app.name">
      <img class="app-icon" :class="{ 'app-icon-down': isMouseDown}" v-if="info.config.app.icon" :src="info.config.app.icon" :data-name="info.app_name || info.config.app.name">
      <div class="app-icon-bg" v-show="info.config.app.icon && info.config.window.status === 'open'">
        <div class="content" :style="appIconBg"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'

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
        let icon = _t.info.config.app.hasOwnProperty('icon') && _t.info.config.app.icon ? _t.info.config.app.icon : null
        if (!icon) {
          return {}
        }
        return {
          backgroundImage: 'url(' + icon + ')'
        }
      }
    },
    methods: {
      // 鼠标按下
      onIconMouseDown: function () {
        let _t = this
        _t.isMouseDown = true
      },
      // 鼠标抬起
      onIconMouseUp: function () {
        let _t = this
        _t.isMouseDown = false
        // 清空预览图
        _t.previewImg = null
        _t.targetWindow = null
        // 应用数据
        let appInfo = {..._t.info}
        // 广播事件 触发window事件 open
        _t.$utils.bus.$emit('platform/window/trigger', {
          // 通过任务栏图标打开
          action: 'openByTaskBarIcon',
          data: {
            appInfo: appInfo
          }
        })
      },
      // 打开当前窗口
      onPreviewMouseUp: function () {
        let _t = this
        // FIXME 【BUG】当存在两个窗口时，当前打开的窗口层级不正确
        // 清空预览图
        _t.previewImg = null
        _t.targetWindow = null
        // 应用数据
        let appInfo = {..._t.info}
        // 广播事件 触发window事件
        _t.$utils.bus.$emit('platform/window/trigger', {
          // 通过预览图打开窗口
          action: 'openByPreviewThumb',
          data: {
            appInfo: appInfo
          }
        })
      },
      // 右键菜单
      onIconRightClick: function (event) {
        let _t = this
        // 清空预览图
        _t.previewImg = null
        _t.targetWindow = null
        _t.$nextTick(function () {
          let xVal = parseInt(event.clientX) - parseInt(event.offsetX)
          let yVal = parseInt(event.clientY) - parseInt(event.offsetY)
          let appName = event.target.dataset['name'] || _t.info.app_name || _t.info.config.app.name || null
          let appInfo = {..._t.info}
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
                text: appInfo.config.window.status === 'open' ? '关闭' : '打开',
                enable: true,
                action: {
                  type: 'bus',
                  handler: 'platform/window/trigger',
                  params: {
                    // 通过桌面图标打开
                    action: 'toggleWindowByContextMenu',
                    data: {
                      appInfo: appInfo,
                      action: appInfo.config.window.status === 'open' ? 'close' : 'open'
                    }
                  }
                }
              },
              {
                name: 'openAppInNewBrowserTab',
                icon: {
                  type: '',
                  style: ''
                },
                text: '在新标签页中打开',
                enable: _t.info.config.window.type === 'iframe' && _t.info.config.app.url,
                action: {
                  type: 'bus',
                  handler: 'platform/app/openInNewBrowserTab'
                }
              },
              (() => {
                if (!['install', 'uninstall'].includes(_t.info.action)) {
                  return {
                    name: 'uninstallApp',
                    icon: {
                      type: '',
                      style: ''
                    },
                    text: '卸载',
                    enable: true,
                    action: {
                      type: 'callback',
                      handler: () => {
                        _t.$utils.uninstall(_t, {
                          // 解构应用基础配置
                          ..._t.info,
                          config: {
                            ..._t.info.config,
                            // 解构应用卸载配置
                            ..._t.info.config.uninstall
                          },
                          // 赋值当前操作为 uninstall
                          action: 'uninstall',
                          // 是否已安装过
                          installed: true
                        })
                      }
                    }
                  }
                }
                return {}
              })(),
              (() => {
                if (_t.info.config.taskBar.isPinned) {
                  return {
                    name: 'unpinToTaskBar',
                    icon: {
                      type: '',
                      style: ''
                    },
                    text: '将此程序从任务栏解锁',
                    enable: _t.info.config.taskBar.isPinned,
                    action: {
                      type: 'bus',
                      handler: 'platform/taskBar/unpin'
                    }
                  }
                } else {
                  return {
                    name: 'pinToTaskBar',
                    icon: {
                      type: '',
                      style: {
                        transform: 'rotate(90deg)'
                      }
                    },
                    text: '将此程序锁定到任务栏',
                    enable: !_t.info.config.taskBar.isPinned,
                    action: {
                      type: 'bus',
                      handler: 'platform/taskBar/pin'
                    }
                  }
                }
              })()
            ]
          }
          // 广播事件
          _t.$utils.bus.$emit('platform/contextMenu/show', contextMenuInfo)
        })
      },
      // 处理鼠标移上事件
      onIconMouseOver: function () {
        let _t = this
        let appInfo = {..._t.info}
        // 转换方法
        let handler = function () {
          console.log('_t.targetWindow', _t.targetWindow.offsetWidth, _t.targetWindow.offsetHeight)
          html2canvas(_t.targetWindow, {
            backgroundColor: null,
            imageTimeout: 0
          }).then(function (canvas) {
            _t.previewImg = canvas.toDataURL()
          }).catch(function (error) {
            console.warn('html2canvas render error!', error)
          })
        }
        // 清空预览图
        _t.previewImg = null
          // 判断应用是否打开
        if (appInfo.config.window.status !== 'open') {
          return
        }
        if (appInfo.config.window.type === 'iframe') {
          _t.previewImg = appInfo.config.app.icon
        } else if (appInfo.config.window.type === 'modal') {
          let appName = appInfo.app_name || appInfo.config.app.name
          _t.targetWindow = document.querySelector('[window-name=' + appName + ']')
          // 判断应用size，当size 为min时无法截图，需将窗口显示在浏览器窗口范围内
          if (appInfo.config.window.size === 'min') {
            // 广播事件 触发window事件
            _t.$utils.bus.$emit('platform/window/trigger', {
              // 预览缩略图显示
              action: 'previewThumbShow',
              data: {
                appInfo: appInfo,
                callback: handler
              }
            })
          } else {
            // 执行处理函数
            handler()
          }
        }
//        setTimeout(function () {
//          html2canvas(targetWindow).then(function (canvas) {
//            _t.previewImg = canvas.toDataURL()
//          }).catch(function (error) {
//            console.error('html2canvas render error!', error)
//          })
//        }, 200)
      },
      // 处理鼠标移出事件
      onIconMouseOut: function () {
        let _t = this
        if (_t.previewImg && _t.targetWindow) {
          _t.previewImg = null
          _t.targetWindow = null
          /*
          let appInfo = {..._t.info}
          // 广播事件 触发window事件
          _t.$utils.bus.$emit('platform/window/trigger', {
            // 预览缩略图关闭
            action: 'previewThumbHide',
            data: {
              appInfo: appInfo
            }
          })
          */
        }
      },
      // 预览当前窗口 打开
      onPreviewMouseOver: function () {
        let _t = this
        let appInfo = {..._t.info}
        // 广播事件 触发window事件
        _t.$utils.bus.$emit('platform/window/trigger', {
          // 通过预览缩略图显示窗口
          action: 'showWindowByPreviewThumb',
          data: {
            appInfo: appInfo
          }
        })
      },
      // 预览当前窗口 关闭
      onPreviewMouseOut: function () {
        let _t = this
        let appInfo = {..._t.info}
        // 广播事件 触发window事件
        _t.$utils.bus.$emit('platform/window/trigger', {
          // 通过预览缩略图隐藏窗口
          action: 'hideByPreviewThumb',
          data: {
            appInfo: appInfo
          }
        })
      }
    },
    created: function () {
      let _t = this
      // 监听事件 清除预览
      _t.$utils.bus.$on('platform/window/preview/clear', function () {
        console.log('created platform/window/preview/clear')
        _t.previewImg = null
        _t.targetWindow = null
      })
    },
    beforeDestroy: function () {
      let _t = this
      _t.$utils.bus.$off([
        'platform/window/preview/clear'
      ])
    }
  }
</script>
