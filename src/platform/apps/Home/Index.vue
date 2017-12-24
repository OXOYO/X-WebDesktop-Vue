/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style scoped lang="less" rel="stylesheet/less">
  .layout-home {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
</style>

<template>
  <div class="layout-home">
    <h1>TODO Home</h1>
    <slot></slot>
  </div>

</template>

<script>
  export default {
    name: 'Home'
  }
</script>
