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

    &.half-left {
      top: 0;
      right: 50%;
      left: 0;
      bottom: 40px;
    }
    &.half-right {
      top: 0;
      right: 0;
      left: 50%;
      bottom: 40px;
    }
    &.full-screen {
      top: 0;
      right: 0;
      left: 0;
      bottom: 40px;
    }

    .content {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, .8);
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
