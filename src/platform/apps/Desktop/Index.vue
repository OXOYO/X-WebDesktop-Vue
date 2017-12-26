/**
* Created by OXOYO on 2017/12/24.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-desktop {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
</style>

<template>
  <div class="app-desktop">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Desktop'
  }
</script>
