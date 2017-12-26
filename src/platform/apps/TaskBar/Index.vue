/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-task-bar {
    position: absolute;
    bottom: 0;
    z-index: 500;
    width: 100%;
    height: 40px;
    display: inline-block;
    .app-task-bar-bg {
      position: absolute;
      bottom: 0;
      z-index: 510;
      width: 100%;
      height: 100%;
      display: inline-block;
      border-top: 1px solid #FFF;
      background: #2A5AAD;
      opacity: .5;
      filter: blur(20px);
      overflow: hidden;
    }
    .app-task-bar-main {
      position: absolute;
      bottom: 0;
      z-index: 520;
      width: 100%;
      height: 100%;
      display: inline-block;
      // #0E2E49
      border-top: 1px solid rgba(14, 46, 73, .3);
      box-sizing: content-box;
    }
    .time-block {
      float: right;
      color: #f5f7f9;
      height: 40px;
      width: 100px;
      display: inline-block;
      /*padding: 0 10px;*/
      text-align: center;
      .time-item {
        display: inline-block;
        width: 100%;
        height: 20px;
      }
    }
  }
</style>

<template>
  <div class="app-task-bar">
    <div class="app-task-bar-bg"></div>
    <div class="app-task-bar-main">
      <slot name="StartMenu"></slot>
      <slot name="TaskBarIconBox"></slot>
      <slot name="TaskBarWidget"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TaskBar'
  }
</script>
