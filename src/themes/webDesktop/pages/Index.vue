/**
* Created by OXOYO on 2017/6/26.
*
* 平台首页
*/

<style scoped lang="less" rel="stylesheet/less">
  .layout {
    height: 100%;
    width: 100%;
    background: #ffffff;
    position: absolute;
  }
</style>

<template>
  <!-- TODO 页面细化 -->
  <div class="layout" :style="layoutStyle">
    <!-- TODO 模拟操作系统 -->
    <Desktop v-if="$route.name === 'platform.index'"></Desktop>
    <!-- FIXME 可能不需要子路由了 -->
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <router-view></router-view>
    </transition>
    <!-- 浏览器版本提示 -->
    <BrowserUpdate></BrowserUpdate>
    <!-- TODO 模板切换工具 -->
    <TemplateSwitch></TemplateSwitch>
  </div>
</template>

<script>
  import Desktop from '../containers/Desktop.vue'
  import BrowserUpdate from '../components/BrowserUpdate.vue'
  import TemplateSwitch from '../components/TemplateSwitch.vue'

  export default {
    name: 'WebDesktopIndex',
    components: {
      Desktop,
      BrowserUpdate,
      TemplateSwitch
    },
    data () {
      return {}
    },
    computed: {
      layoutStyle: function () {
        let _t = this
        let tmpObj = {}
        if (_t.$route.name === 'platform.index') {
          tmpObj['overflow'] = 'hidden'
        }

        return tmpObj
      }
    }
  }
</script>

