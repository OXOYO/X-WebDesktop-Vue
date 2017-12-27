/**
* Created by OXOYO on 2017/12/26.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .task-bar-icon {
    display: inline-block;
    width: 60px;
    height: 39px;
    margin: 0 4px;
    position: relative;
    user-select:none;
    &.task-bar-icon-pinned {
    }
    .task-bar-icon-main{
      width: 60px;
      height: 39px;
      line-height: 39px;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: all .2s ease-out;
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
  <!-- v-if="info.modal.isShow || info.taskBar.isPinned" -->
  <div
    class="task-bar-icon"
    :class="{ 'task-bar-icon-pinned': info.taskBar.isPinned }"
    @mousedown.left.stop.prevent="mouseDownHandle"
    @mouseup.left.stop.prevent="mouseUpHandle"
    @contextmenu.stop.prevent="taskBarIconRightClick($event)"
    :title="info.app.title"
    :data-name="info.app.name"
  >
    <!-- 图标 -->
    <div class="task-bar-icon-main" :class="{ 'app-open': info.modal.isShow }" :data-name="info.app.name">
      <img class="app-icon" :class="{ 'app-icon-down': isMouseDown}" v-if="info.app.icon" :src="info.app.icon" :data-name="info.app.name">
      <div class="app-icon-bg" v-show="info.app.icon && info.modal.isShow" :style="appIconBg"></div>
    </div>
  </div>
</template>

<script>
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
        isMouseDown: false
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
      mouseDownHandle: function () {
        let _t = this
        _t.isMouseDown = true
      },
      // 鼠标抬起
      mouseUpHandle: function () {
        let _t = this
        _t.isMouseDown = false
      },
      // 右键菜单
      taskBarIconRightClick: function (event) {
        let _t = this
        let xVal = parseInt(event.clientX)
        let yVal = parseInt(event.clientY)
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
          }
        }
        console.log('contextMenuInfo', contextMenuInfo)
        // 分发mutation
        // _t.$store.commit('Platform/webDesktop/components/contextMenu/update', contextMenuInfo)
      }
    }
  }
</script>
