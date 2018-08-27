/**
* Created by OXOYO on 2017/11/17.
*
* 分屏预览
*/

<style scoped lang="less" rel="stylesheet/less">
  .split-screen {
    position: absolute;
    z-index: 1999;
    padding: 10px;

    &.left-top {
      top: 0;
      right: 50%;
      bottom: 50%;
      left: 0;
    }
    &.left-bottom {
      top: 50%;
      right: 50%;
      bottom: 40px;
      left: 0;
    }
    &.right-top {
      top: 0;
      right: 0;
      bottom: 50%;
      left: 50%;
    }
    &.right-bottom {
      top: 50%;
      right: 0;
      bottom: 40px;
      left: 50%;
    }
    &.left {
      top: 0;
      right: 50%;
      bottom: 40px;
      left: 0;
    }
    &.right {
      top: 0;
      right: 0;
      bottom: 40px;
      left: 50%;
    }
    &.full-screen {
      top: 0;
      right: 0;
      bottom: 40px;
      left: 0;
    }

    .content {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 5px 5px rgba(0, 0, 0, .2);
    }
  }
</style>

<template>
  <div
    v-show="splitScreenData.enable"
    class="split-screen"
    :class="splitScreenData.type"
  >
    <div class="content"></div>
  </div>
</template>

<script>
  export default {
    name: 'SplitScreen',
    data () {
      return {
        splitScreenData: {}
      }
    },
    props: {
      data: {
        type: Object,
        required: true,
        default: () => {
          return {
            enable: false,
            // 分屏模式
            type: ''
          }
        }
      }
    },
    watch: {
      data: {
        handler: function (val) {
          let _t = this
          console.log('splitScreenData', val)
          _t.splitScreenData = val
        },
        deep: true
      }
    }
  }
</script>
