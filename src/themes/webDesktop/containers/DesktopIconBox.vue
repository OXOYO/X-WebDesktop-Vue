/**
* Created by OXOYO on 2017/6/29.
* 桌面图标容器
*/

<style scoped lang="less" rel="stylesheet/less">
  .desktop-icon-box {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    writing-mode: vertical-lr;
  }
</style>

<template>
  <div class="desktop-icon-box">
    <!-- 应用列表 -->
    <DesktopIcon v-for="item in desktopIconData.iconList" :key="item.app.id" :info="item" :showTitle="desktopIconData.showTitle"></DesktopIcon>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import DesktopIcon from '../components/DesktopIcon.vue'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  export default {
    name: 'DesktopIconBox',
    components: {
      DesktopIcon
    },
    props: {
      desktopIcon: {
        type: Object,
        default: () => {
          return {
            iconList: [],
            showTitle: true
          }
        },
        required: true
      }
    },
    data () {
      return {
//        desktopIconData: {
//          iconList: [],
//          showTitle: true
//        }
      }
    },
    watch: {
      desktopIcon: {
        handler: function (val, oldVal) {
          let _t = this
          _t.desktopIconData = val
        },
        deep: true
      }
    },
    computed: {
      ...mapState('Platform/' + moduleName, {
        // 桌面图标
        desktopIconData: state => {
          return {
            // TODO 应该通过接口获取
            iconList: state.components.desktop.iconList,
            showTitle: state.components.desktop.showTitle
          }
        }
      })
    }
  }
</script>

