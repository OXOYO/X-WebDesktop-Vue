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
  <div
    class="app-desktop-icon-box"
    @drop.stop.prevent="handlerDrop"
    @dragover.stop.prevent
  >
    <!-- 应用列表 -->
    <DesktopIcon
      v-for="item in iconList"
      :key="item.app.id"
      :info="item"
      :showTitle="appData.showTitle"
      :style="item.desktopIcon.style"
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
            // 自动排布
            autoLayer: true,
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
        // 每个图标宽高80px margin 10px
        let itemWidthHeight = 100
        let xNum = width % itemWidthHeight
        let yNum = height % itemWidthHeight
        // 列计数器
        let col = 0
        // 行计数器
        let row = 0
        // FIXME 需要减掉 taskBar 的高或宽，减高或减宽取决于taskBar的上右下左位置
        for (let i in _t.appData.iconList) {
          let item = _t.appData.iconList[i]
          if (!item.desktopIcon.style) {
            item.desktopIcon.style = {}
          }
          if (row <= yNum) {
            item.desktopIcon.style = {
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
    },
    methods: {
      // 节点drop
      handlerDrop: function (event) {
        let _t = this
        // 获取拖拽对象数据
        let targetInfo = JSON.parse(event.dataTransfer.getData('Text'))
        // TODO 判断target，根据target分别处理
        console.log('targetInfo.target', targetInfo.target)
        switch (targetInfo.target) {
          case 'DesktopIcon':
            _t.handlerDesktopIconDrop(targetInfo, event)
            break
        }
      },
      // 处理桌面图标drop
      handlerDesktopIconDrop: function (targetInfo, event) {
        let _t = this
        let data = targetInfo.data || {}
        // 健壮，防止空数据
        if (!Object.keys(data).length) {
          return
        }
        let xVal = event.clientX - data.offsetX
        let yVal = event.clientY - data.offsetY
        let style = {
          'left': xVal + 'px',
          'top': yVal + 'px'
        }

        for (let i = 0, len = _t.iconList.length; i < len; i++) {
          if (_t.iconList[i].app.name === data.name) {
            console.log('handlerDesktopIconDrop style', i, data.name, style)
            // FIXME 【BUG】 style更新无效
            _t.iconList[i]['desktopIcon']['style'] = style
          }
        }
      }
    }
  }
</script>
