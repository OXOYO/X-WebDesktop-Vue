/**
* Created by OXOYO on 2017/7/3.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-main {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>

<template>
  <div class="app-main">
    <MainPage></MainPage>
  </div>
</template>

<script>
  import Store from './store'
  import MainPage from './pages/MainPage.vue'

  export default {
    name: 'ApplicationMarket',
    components: {
      MainPage
    },
    methods: {

    },
    created: function () {
      let _t = this
      // 将store注册到apps下
      _t.$store.registerModule(['Apps', Store.moduleName], Store.store)
    },
    destroyed: function () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['Apps', Store.moduleName])
    }
  }
</script>

