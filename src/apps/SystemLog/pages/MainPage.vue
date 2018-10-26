/**
* Created by OXOYO on 2018/8/24.
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
    <SearchLogs></SearchLogs>
    <!-- 日志详情 -->
    <DetailLog></DetailLog>
  </div>
</template>

<script>
  import SearchLogs from '../components/SearchLogs.vue'
  import DetailLog from '../components/DetailLog.vue'

  export default {
    name: 'MainPage',
    components: {
      SearchLogs,
      DetailLog
    },
    props: {
      info: {
        type: Object
      }
    }
  }
</script>
