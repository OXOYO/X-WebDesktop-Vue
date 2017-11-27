/**
* Created by OXOYO on 2017/6/30.
* 应用弹窗
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-modal {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 600;
    display: block;
    background: #fff;
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, .1);

    &.app-modal-small {
      width: 300px;
      height: 200px;
      margin-left: -150px;
      margin-top: -100px;
    }
    &.app-modal-middle {
      width: 800px;
      height: 600px;
      margin-left: -400px;
      margin-top: -300px;
    }
    &.app-modal-min {
      display: none;
    }
    &.app-modal-max {
      display: block;
      top: 0;
      right: 0;
      bottom: 42px;
      left: 0;
    }

    .app-modal-resize {
      width: 10px;
      height: 10px;
      position: absolute;
      background: red;
      z-index: 610;

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
    }

    .app-modal-header {
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

      .app-drag {
        position: absolute;
        left: 0;
        right: 96px;
        height: 100%;
      }
      .app-title {
        text-align: left;
        margin-left: 15px;
      }
      .func-icon-list {
        /*width: 66px;*/
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        margin: 0 15px;
        text-align: right;

        .func-icon {
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
    .app-modal-body {
      position: absolute;
      top: 30px;
      bottom: 0;
      z-index: 600;
      overflow: auto;
      width: 100%;
      padding: 10px;
    }
    .ripple {
      display: none;
      position: absolute;
      background: hsl(180, 40%, 80%);
      border-radius: 100%;
      transform: scale(0);

      &.animate {
        display: block;
        animation: ripple 0.65s linear;
      }
    }
    @keyframes ripple {
      100% {
        opacity: 0;
        transform: scale(2.5);
      }
    }
    .app-modal-iframe {
      width: 100%;
      height: 100%;
    }
  }
</style>

<template>
  <div
    class="app-modal"
    :class="modalSize"
    :style="modalStyle"
    :title="info.app.title"
    v-if="info.modal.isShow"
    @click.stop="triggerModal"
    draggable="true"
    @dragstart="dragStartHandle"
  >
    <!--@drag="dragMoveHandel"-->
    <!-- 水波动画埋点 -->
    <div class="ripple" :class="{ animate: !!splitScreenType }" :style="rippleStyle"></div>
    <!-- reSize FIXME 此功能暂时延后开发 -->
    <!--
    <div class="app-modal-resize resize-top-left" @mousedown.self.stop.prevent="startResize" @mouseup.stop.prevent="stopResize"></div>
    <div class="app-modal-resize resize-top-right" @mousedown="startResize"></div>
    <div class="app-modal-resize resize-bottom-left" @mousedown="startResize"></div>
    <div class="app-modal-resize resize-bottom-right" @mousedown="startResize"></div>
    -->
    <div
      class="app-modal-header"
      @dblclick.stop.prevent="toggleModalStatus"
    >
      <!-- 拖拽标签 -->
      <!--<div
        class="app-drag"
        draggable="true"
        @dragstart="dragStartHandle"
      ></div>-->
      <div class="app-title">{{ info.app.title }}</div>
      <div class="func-icon-list">
        <!-- 最小化 -->
        <div
          v-if="enableResize.includes('min')"
          class="func-icon"
          @click.stop.prevent="handleModalStatus('min')"
        >
          <Icon type="minus"></Icon>
        </div>
        <!-- 最大化 -->
        <div
          v-if="enableResize.includes('max') && info.modal.size !== 'max'"
          class="func-icon"
          @click.stop.prevent="handleModalStatus('max')"
        >
          <Icon type="android-checkbox-outline-blank"></Icon>
        </div>
        <!-- 还原 -->
        <div
          v-if="enableResize.includes('reset') && info.modal.size === 'max'"
          class="func-icon"
          @click.stop.prevent="handleModalStatus('reset')"
        >
          <Icon type="ios-browsers-outline"></Icon>
        </div>
        <!-- 关闭 -->
        <div
          v-if="enableResize.includes('close')"
          class="func-icon"
          @click.stop.prevent="handleModalStatus('close')"
        >
          <Icon type="close"></Icon>
        </div>
      </div>
    </div>
    <div class="app-modal-body">
      <iframe
        class="app-modal-iframe"
        v-if="info.modal.type && info.modal.type === 'iframe'"
        :src="info.app.url"
        frameborder="0"
      >
      </iframe>
      <keep-alive>
        <component :is="info.component" v-if="!(info.modal.type && info.modal.type === 'iframe') && !info.closeApp"></component>
      </keep-alive>
      <slot></slot>
    </div>
    <div class="app-modal-footer"></div>
  </div>
</template>

<script>

  export default {
    name: 'AppModal',
    data () {
      return {
        // 水波动画样式
        rippleStyle: {},
        // 分屏类型
        splitScreenType: '',
        // 是否开始缩放标识
        isStartResize: false
      }
    },
    props: {
      info: {
        type: Object,
        default: function () {
          return {}
        },
        required: true
      }
    },
    computed: {
      modalSize: function () {
        let _t = this
        let className = ''
        switch (_t.info.modal.size) {
          case 'min':
            className = 'app-modal-min'
            break
          case 'small':
            className = 'app-modal-small'
            break
          case 'middle':
            className = 'app-modal-middle'
            break
          case 'max':
            className = 'app-modal-max'
            break
          default:
            className = 'app-modal-middle'
        }
        return className
      },
      modalStyle: function () {
        let _t = this
        return {
          ..._t.info.modal.style,
          'z-index': _t.info.modal.zIndex
        }
      },
      enableResize: function () {
        let _t = this
        return _t.info.modal.enableResize ? _t.info.modal.enableResize : ['min', 'max', 'reset', 'close']
      }
    },
    methods: {
      // 处理弹窗点击
      triggerModal: function () {
        let _t = this
        // 更新当前弹窗层级
        _t.$store.commit('Platform/webDesktop/components/appModalBox/changeZIndex', _t.info)
      },
      // 双击切换窗口状态
      toggleModalStatus: function () {
        let _t = this
        let tmpInfo
        let appInfo = _t.info
        let currentSize = appInfo.modal.size
        // let oldSize = appInfo.modal.oldSize
        let currentStyle = appInfo.modal.style
        let oldStyle = appInfo.modal.oldStyle
        let newSize = currentSize === 'max' ? 'middle' : 'max'
        let newStyle = currentSize === 'max' ? oldStyle : ''
        tmpInfo = {
          ...appInfo,
          modal: {
            ...appInfo.modal,
            size: newSize,
            oldSize: currentSize,
            style: newStyle,
            oldStyle: currentStyle
          }
        }

        if (!tmpInfo) {
          return
        }
        // 更新当前弹窗状态
        _t.$store.dispatch('Platform/webDesktop/components/appModalBox/toggleApp', tmpInfo)
        // 分发mutation，更新任务栏图标信息
        _t.$store.commit('Platform/webDesktop/components/taskBarBox/toggleApp', tmpInfo)
        // 更新当前弹窗层级
        _t.$store.commit('Platform/webDesktop/components/appModalBox/changeZIndex', tmpInfo)
      },
      // 处理弹窗状态
      handleModalStatus: function (actionName = 'close') {
        let _t = this
        let tmpInfo
        let appInfo = _t.info
        let currentSize = appInfo.modal.size
        // let oldSize = appInfo.modal.oldSize
        let currentStyle = appInfo.modal.style
        let oldStyle = appInfo.modal.oldStyle
        switch (actionName) {
          case 'min':
            tmpInfo = {
              ...appInfo,
              modal: {
                ...appInfo.modal,
                size: 'min',
                oldSize: currentSize
              }
            }
            break
          case 'reset':
            tmpInfo = {
              ...appInfo,
              modal: {
                ...appInfo.modal,
                // size: oldSize === 'max' ? 'middle' : oldSize,
                size: 'middle',
                oldSize: currentSize,
                style: oldStyle,
                oldStyle: currentStyle
              }
            }
            break
          case 'max':
            tmpInfo = {
              ...appInfo,
              modal: {
                ...appInfo.modal,
                size: 'max',
                oldSize: currentSize,
                style: '',
                oldStyle: currentStyle
              }
            }
            break
          case 'close':
            tmpInfo = {
              ...appInfo,
              modal: {
                ...appInfo.modal,
                isShow: false
              },
              closeApp: true
            }
            break
        }
        if (!tmpInfo) {
          return
        }
        // 更新当前弹窗状态
        _t.$store.dispatch('Platform/webDesktop/components/appModalBox/toggleApp', tmpInfo)
        // 分发mutation，更新任务栏图标信息
        _t.$store.commit('Platform/webDesktop/components/taskBarBox/toggleApp', tmpInfo)
      },
      // 拖拽处理
      dragStartHandle: function (event) {
        let _t = this
        let appInfo = _t.info

        if (_t.isStartResize) {
          event.stopPropagation()
          event.preventDefault()
          return
        }
        // 判断当前窗口大小
        if (appInfo.modal.size === 'max') {
          _t.handleModalStatus('reset')
        }
        // 鼠标点击位置相对拖拽对象位置
        let offsetX = event.offsetX
        let offsetY = event.offsetY

        // 拖拽对象数据
        let targetInfo = {
          type: 'AppModal',
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
      dragMoveHandel: function (event) {
        let _t = this
        // 允许范围 5px
        let range = 5
        let xVal = event.clientX
        let offsetX = event.offsetX
        let yVal = event.clientY
        let offsetY = event.offsetY
        let splitScreenType
        let rippleStyle = {
          left: offsetX + 'px',
          top: offsetY + 'px'
        }
        if (Math.abs(yVal) < range) {
          splitScreenType = 'max'
        } else if (Math.abs(xVal) < range) {
          splitScreenType = 'half'
        } else if (Math.abs(xVal - document.body.clientWidth) < range) {
          splitScreenType = 'half'
        }
        _t.splitScreenType = splitScreenType
        _t.rippleStyle = rippleStyle
      },
      // 开始缩放
      startResize: function () {
        let _t = this
        // 更新窗口缩放数据
        _t.$store.commit('Platform/webDesktop/components/appModalBox/reSize/update', {
          isStartResize: true,
          appName: _t.info.app.name
        })
      },
      // 缩放中
      moveResize: function (event) {
        let _t = this
        if (_t.isStartResize) {
          console.log(event.pageX, event.pageY)
        }
      },
      // 缩放停止
      stopResize: function () {
        let _t = this
        // 更新窗口缩放数据
        _t.$store.commit('Platform/webDesktop/components/appModalBox/reSize/update', {
          isStartResize: false,
          appName: ''
        })
      }
    },
    created: function () {
      let _t = this
      // 备份原有size
      let tmpInfo = {
        ..._t.info,
        modal: {
          ..._t.info.modal
          // ,
          // oldSize: _t.info.modal.size
        }
      }
      // 更新当前弹窗状态
      _t.$store.dispatch('Platform/webDesktop/components/appModalBox/toggleApp', tmpInfo)
      // 分发mutation，更新任务栏图标信息
      _t.$store.commit('Platform/webDesktop/components/taskBarBox/toggleApp', tmpInfo)
      // 更新当前弹窗层级
      // _t.$store.commit('Platform/webDesktop/components/appModalBox/changeZIndex', tmpInfo)
    }
  }
</script>

