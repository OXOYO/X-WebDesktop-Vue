/**
* Created by OXOYO on 2017/12/26.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .desktop-icon {
    width: 80px;
    height: 80px;
    margin: 10px;
    padding: 5px;
    text-align: center;
    display: inline-block;
    position: absolute;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 2px;
    transition: all .2s ease-out;
    user-select:none;
    writing-mode: lr-tb;

    &:after {
      content: ' ';
      position: absolute;
      display: block;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(255, 255, 255, .5);
      filter: blur(25px);
      opacity: 0;
      overflow: hidden;
    }
    &:hover {
      /*background: rgba(250, 253, 255, .3);*/
      border-color: #B9D7FC;
      &:after {
        opacity: 1;
      }
    }
    img {
      display: block;
      width: 48px;
      height: 48px;
      margin: 0 auto;
    }
    .desktop-icon-down {
      width: 47px;
      height: 47px;
    }
    span {
      display: inline-block;
      width: 100%;
      color: #ffffff;
      cursor: default;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>

<template>
  <div
    class="desktop-icon"
    @mousedown.left="mouseDownHandle"
    @dblclick="openApp"
    @contextmenu.stop.prevent="handlerRightClick($event)"
    draggable="true"
    @dragstart="handlerDragStart"
    :title="info.app.title"
    :data-name="info.app.name"
  >
    <img :class="{ 'desktop-icon-down': isMouseDown}" v-if="info.app.icon" :src="info.app.icon" :data-name="info.app.name">
    <span v-if="showTitle" :data-name="info.app.name">{{ info.app.title }}</span>
  </div>
</template>

<script>
  export default {
    name: 'DesktopIcon',
    props: {
      info: {
        type: Object,
        default: () => {
          return {
            app: {
              icon: '',
              title: '',
              name: '',
              id: '',
              index: ''
            },
            modal: {
              size: '',
              isShow: false
            },
            taskBar: {
              isPinned: false
            }
          }
        },
        required: true
      },
      showTitle: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        isMouseDown: false
      }
    },
    methods: {
      // 鼠标按下
      mouseDownHandle: function () {
        let _t = this
        _t.isMouseDown = true
      },
      // 打开应用
      openApp: function () {
        let _t = this
        _t.isMouseDown = false
        let appInfo = {..._t.info}
        appInfo.window.status = 'open'
        // TODO 处理应用打开相关操作
        _t.$Message.info('打开应用: ' + appInfo.app.title)
        // 广播事件
        _t.$utils.bus.$emit('platform/window/open', appInfo)
      },
      // 右键菜单
      handlerRightClick: function (event) {
        let _t = this
        let xVal = parseInt(event.clientX)
        let yVal = parseInt(event.clientY)
        let appName = event.target.dataset['name'] || _t.info.app.name || null
        // 菜单信息
        let contextMenuInfo = {
          isShow: true,
          x: xVal,
          y: yVal,
          target: 'desktopIcon',
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
            }
          ]
        }
        // 广播事件
        _t.$utils.bus.$emit('platform/contextMenu/show', contextMenuInfo)
      },
      // FIXME 拖拽处理，可以考虑实现选区拖拽
      handlerDragStart: function (event) {
        let _t = this
        // 广播事件，关闭菜单
        _t.$utils.bus.$emit('platform/contextMenu/hide')
        let appInfo = _t.info
        // 鼠标点击位置相对拖拽对象位置
        let offsetX = event.offsetX
        let offsetY = event.offsetY
        // 拖拽对象数据
        let targetInfo = {
          target: 'DesktopIcon',
          data: {
            id: appInfo.app.id,
            title: appInfo.app.title,
            name: appInfo.app.name,
            offsetX: offsetX,
            offsetY: offsetY,
            appInfo: appInfo
          }
        }
        event.dataTransfer.setData('Text', JSON.stringify(targetInfo))
      }
    }
  }
</script>
