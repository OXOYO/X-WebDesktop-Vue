/**
* Created by OXOYO on 2018/4/23.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    display: inline-block;
    text-align: center;
    overflow: hidden;

    .iframe-box {
      margin: 0 auto;
    }
  }
</style>

<template>
  <div class="main-page">
    <iframe
      class="iframe-box"
      name="iframe-box"
      src="//i.tianqi.com/index.php?c=code&id=55"
      width="255"
      height="294"
      frameborder="0"
      marginwidth="0"
      marginheight="0"
      scrolling="no"
    >
    </iframe>
  </div>
</template>

<script>
  export default {
    name: 'MainPage'
  }
</script>
