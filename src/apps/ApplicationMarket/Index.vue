/**
* Created by OXOYO on 2018/4/20.
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
  import MainPage from './pages/MainPage.vue'
  import Store from './store'

  export default {
    name: 'ApplicationMarket',
    components: {
      MainPage
    },
    data () {
      return {
        isLoading: true
      }
    },
    created: function () {
      let _t = this

      setTimeout(function () {
        _t.isLoading = false
      }, 200)
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

