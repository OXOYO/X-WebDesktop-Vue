/**
* Created by OXOYO on 2018/9/7.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .content-page {
    display: inline-block;
    width: 100%;
    height: calc(~'100% - 80px');
    overflow: hidden;

    .iframe-box {
      margin: 0 auto;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
</style>

<template>
  <div class="content-page">
    <iframe
      v-for="(item, key) in tabPageMap"
      v-show="key === currentTabIndex"
      :key="key"
      :src="item.url"
      ref="iframes"
      class="iframe-box"
      name="iframe-box"
      frameborder="0"
      marginwidth="0"
      marginheight="0"
    >
    </iframe>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  export default {
    name: 'ContentPage',
    computed: {
      ...mapState('Apps/' + moduleName, {
        tabPageMap: state => state.tabPageMap,
        currentTabIndex: state => state.currentTabIndex
      }),
      currentTab: function () {
        let _t = this
        return _t.tabPageMap[_t.currentTabIndex]
      }
    },
    methods: {
      handleUrl: function (url) {
        if (url) {
          url = url.replace(/^(https|http|ftp|rtsp|mms)?/i, 'http')
        }
      }
    },
    created: function () {
      let _t = this
      _t.$utils.bus.$on('Apps/GoFire/tab/refresh', function (data) {
        _t.$refs.iframes[data.index].contentWindow.location = null
        setTimeout(function () {
          _t.$refs.iframes[data.index].contentWindow.location = data.info.url
        }, 0)
      })
    }
  }
</script>
