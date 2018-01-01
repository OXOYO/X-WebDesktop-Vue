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
      v-for="item in iconList"
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
    },
    computed: {
      iconList: function () {
        let _t = this
        let tmpArr = []
        // 处理宽高
        let height = document.body.clientHeight
        let width = document.body.clientWidth
        // 每个图标宽高80px
        let itemWidthHeight = 80
        let xNum = width % itemWidthHeight
        let yNum = height % itemWidthHeight
        // 列计数器
        let col = 0
        // 行计数器
        let row = 0
        // FIXME 需要减掉 taskBar 的高或宽，减高或减宽取决于taskBar的上右下左位置
        for (let i in _t.appData.iconList) {
          let item = _t.appData.iconList[i]
          if (!item.app.style) {
            item.app.style = {}
          }
          if (row <= yNum) {
            item.app.style = {
              left: col * itemWidthHeight + 'px',
              top: row * itemWidthHeight + 'px'
            }
            row++
          } else {
            row = 0
            if (col < xNum) {
              col++
            } else {
              console.log('Col needs less than xNum')
            }
          }
          console.log('item.app.style', item.app.title, item.app.style)
          tmpArr[i] = item
        }
        console.log('tmpArr', tmpArr)
        return tmpArr
      }
    }
  }
</script>
