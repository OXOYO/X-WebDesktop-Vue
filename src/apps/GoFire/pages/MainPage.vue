/**
* Created by OXOYO on 2018/8/24.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

<template>
  <div class="main-page">
    <!-- 标签页 -->
    <TabPage></TabPage>
    <!-- 内容页 -->
    <ContentPage></ContentPage>
  </div>
</template>

<script>
  import TabPage from '../components/TabPage'
  import ContentPage from '../components/ContentPage'

  export default {
    name: 'MainPage',
    components: {
      TabPage,
      ContentPage
    },
    props: {
      info: {
        type: Object
      }
    }
  }
</script>
