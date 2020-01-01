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
      :tabIndex="key"
      :src="item.url"
      ref="iframes"
      class="iframe-box"
      name="iframe-box"
      frameborder="0"
      marginwidth="0"
      marginheight="0"
      @load="handleOnload(key)"
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
      },
      handleOnload: function (tabIndex) {
        let _t = this
        let targetIframe = _t.$refs.iframes.find(item => item.tabIndex + '' === tabIndex + '')
        let targetTab = _t.tabPageMap[tabIndex]
        if (targetIframe) {
          let title = ''
          try {
            title = targetIframe.contentWindow.document.title
          } catch (e) {
            title = targetTab.url
          }
          _t.$store.commit('Apps/GoFire/tab/update', {
            index: tabIndex,
            info: {
              ...targetTab,
              title: title
            }
          })
        }
      }
    },
    created: function () {
      let _t = this
      _t.$utils.bus.$on('Apps/GoFire/tab/refresh', function (data) {
        let targetIframe = _t.$refs.iframes.find(item => item.tabIndex + '' === data.index + '')
        targetIframe.contentWindow.location = null
        setTimeout(function () {
          targetIframe.contentWindow.location = data.info.url
        }, 0)
      })
    }
  }
</script>
