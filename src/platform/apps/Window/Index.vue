/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-window {
    position: absolute;
    z-index: 8888;
    background: rgba(0, 0, 0, .5);
  }
</style>

<template>
  <div class="app-window">
    <template
      v-for="item in windowList"
    >
      <WinModal v-if="item.window.type && item.window.type === 'modal'" :info="item"></WinModal>
      <WinIFrame v-if="item.window.type && item.window.type === 'iframe'" :info="item"></WinIFrame>
    </template>
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
    data () {
      return {
        windowList: []
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
