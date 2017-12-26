/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-desktop-icon-box {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    writing-mode: vertical-lr;
  }
</style>

<template>
  <div class="app-desktop-icon-box">
    <!-- 应用列表 -->
    <DesktopIcon
      v-for="item in appData.iconList"
      :key="item.app.id"
      :info="item"
      :showTitle="appData.showTitle"
    >
    </DesktopIcon>
  </div>
</template>

<script>
  import DesktopIcon from './components/DesktopIcon.vue'

  export default {
    name: 'DesktopIconBox',
    components: {
      DesktopIcon
    },
    props: {
      appData: {
        type: Object,
        default: () => {
          return {
            iconList: [],
            showTitle: true
          }
        },
        required: true
      }
    }
  }
</script>
