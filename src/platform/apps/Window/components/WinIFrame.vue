/**
* Created by OXOYO on 2018/1/12.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-window-iframe {
    width: 100%;
    height: 100%;
    background: #ffffff;
  }
</style>

<template>
  <iframe
    class="app-window-iframe"
    :src="info.config.app.url"
    frameborder="0"
  >
  </iframe>
</template>

<script>
  export default {
    name: 'WinIFrame',
    props: {
      info: {
        type: Object,
        required: true
      }
    }
  }
</script>

