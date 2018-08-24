/**
* Created by yangfan9244 on 2018/8/24.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>

<template>
  <div class="main-page">
    <h1>TODO DemoApp MainPage</h1>
  </div>
</template>

<script>
  export default {
    name: 'MainPage',
    props: {
      info: {
        type: Object
      }
    }
  }
</script>
