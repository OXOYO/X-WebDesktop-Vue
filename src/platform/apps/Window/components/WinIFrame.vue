/**
* Created by OXOYO on 2018/1/12.
*
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div>
    <h1>TODO WinIFrame</h1>
    <h1>{{ info.app.title }}</h1>
  </div>
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

