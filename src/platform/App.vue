<style>
  html {
    height: 100%;
    width: 100%;
  }
  body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  /* 根组件修改iview $Message组件样式 */
  .ivu-message {
    font-size: 12px;
    position: fixed;
    z-index: 1010;
    top: 16px;
    height: auto;
    width: auto;
    display: inline-block;
    left: 50%;
  }
  .ivu-message-notice {
    width: auto;
    vertical-align: middle;
    left: 0;
    display: block;
    clear: both;
    position: relative;
    margin-bottom: 5px;
  }
</style>

<template>
  <!--<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">-->
  <router-view></router-view>
  <!--</transition>-->
</template>

<script>
  export default {
    name: 'App'
  }
</script>
