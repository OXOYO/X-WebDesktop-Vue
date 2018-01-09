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
  .grid-item {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 1px solid red;
    border-radius: 10px;
    background: rgba(0, 0, 0, .3);
    color: red;
    writing-mode: horizontal-tb;
    text-align: center;

    .grid-item-label {
      width: 100%;
      padding: 5px;
      text-align: left;
    }
  }
</style>

<template>
  <div
    class="app-desktop-icon-box"
    @drop.stop.prevent="handlerDrop"
    @dragover.stop.prevent
  >
    <!-- FIXME grid列表，调试用，后期可删除 -->
    <div
      class="grid-item"
      v-if="isShowGrid"
      v-for="(item, index) in gridArr"
      :style="{ left: item.leftTop.x + 'px', top: item.leftTop.y + 'px' }"
    >
      <div class="grid-item-label">{{ index }}</div>
      <div class="grid-item-label">
        LT: {{ item.leftTop.x + ', ' + item.leftTop.y }}
      </div>
      <div class="grid-item-label">
        RB: {{ item.rightBottom.x + ', ' + item.rightBottom.y }}
      </div>
    </div>
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
  import { mapState } from 'vuex'
  import DesktopIcon from './components/DesktopIcon.vue'

  export default {
    name: 'DesktopIconBox',
    components: {
      DesktopIcon
    },
//    props: {
//      appData: {
//        type: Object,
//        default: () => {
//          return {
//            iconList: [],
//            // 自动排布
//            autoLayer: true,
//            showTitle: true
//          }
//        },
//        required: true
//      }
//    },
    data () {
      return {
        gridArr: [],
        isShowGrid: false
      }
    },
    computed: {
      ...mapState('Platform/Admin', {
        appData: state => state.appData
      }),
      iconList: function () {
        let _t = this
        let tmpArr = []
        // 处理宽高
        let height = document.body.clientHeight
        let width = document.body.clientWidth
        // 每个图标宽高80px margin 10px
        let itemWidthHeight = 100
        let xNum = Math.floor(width / itemWidthHeight)
        let yNum = Math.floor(height / itemWidthHeight)
        // 列计数器
        let col = 0
        // 行计数器
        let row = 0
        // FIXME 需要减掉 taskBar 的高或宽，减高或减宽取决于taskBar的上右下左位置
        for (let i in _t.appData.iconList) {
          let item = _t.appData.iconList[i]
          if (!item.desktopIcon.dragFlag) {
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
      handlerDesktopIconDrop: function (targetInfo) {
        let _t = this
        let targetData = targetInfo.data || {}
        // 健壮，防止空数据
        if (!Object.keys(targetData).length) {
          return
        }
        // 1.计算 icon drop 时的坐标
        let xVal = event.clientX - targetData.offsetX
        let yVal = event.clientY - targetData.offsetY
        // 2.查找 icon drop 时所处的grid
        // 2.1.遍历gridArr，计算与每个grid的leftTop、rightBottom点的距离
        let distanceArr = []
        for (let item of _t.gridArr) {
          let distanceLeftTop = Math.sqrt(Math.pow(yVal - item.leftTop.y, 2) + Math.pow(xVal - item.leftTop.x, 2))
          let distanceRightBottom = Math.sqrt(Math.pow(yVal - item.rightBottom.y, 2) + Math.pow(xVal - item.rightBottom.x, 2))
          distanceArr.push(distanceLeftTop + distanceRightBottom)
        }
        let count = 0
        // 2.2.递归查找距离最小且未占用的grid
        let findGrid = function (tmpDistanceArr) {
          count++
          // 2.2.1.求距离最小值
          let minDistance = Math.min(...tmpDistanceArr)
          // 2.2.2.获取距离最小的grid index值，注意需要从 distanceArr 完整数据中获取
          let minDistanceIndex = distanceArr.indexOf(minDistance)
          console.log('minDistance', minDistance, minDistanceIndex, distanceArr.length, tmpDistanceArr.length)
          // 2.2.3.目标Grid
          let targetGrid = _t.gridArr[minDistanceIndex]
          // 2.2.4.查找当前grid中是否已有icon，如果有则查找距离次之的grid
          let iconList = [
            ..._t.iconList
          ]
          // 2.2.5.是否已占据标识
          let isOccupied = false
          for (let item of iconList) {
            if (item.desktopIcon && item.desktopIcon.style) {
              let leftVal = parseFloat(item.desktopIcon.style.left)
              let topVal = parseFloat(item.desktopIcon.style.top)
              if (leftVal === targetGrid.leftTop.x && topVal === targetGrid.leftTop.y && item.app.name !== targetData.name) {
                isOccupied = true
                break
              }
            }
          }
          // 2.2.6.查找距离次之的grid
          if (isOccupied) {
            // 移除距离最小项
            tmpDistanceArr = tmpDistanceArr.filter(item => {
              return item !== minDistance
            })
            targetGrid = findGrid(tmpDistanceArr)
          }
          return targetGrid
        }
        // 目标Grid
        let targetGrid = findGrid(distanceArr)
        console.log('count', count)
        // 更新style
        let style = {
          'left': targetGrid.leftTop.x + 'px',
          'top': targetGrid.leftTop.y + 'px'
        }
        let iconList = [
          ..._t.iconList
        ]
        for (let i = 0, len = iconList.length; i < len; i++) {
          if (iconList[i].app.name === targetData.name) {
            console.log('handlerDesktopIconDrop style', i, targetData.name, style)
            iconList[i]['desktopIcon']['dragFlag'] = true
            iconList[i]['desktopIcon']['style'] = style
          } else {
            iconList[i]['desktopIcon']['dragFlag'] = !!iconList[i]['desktopIcon']['dragFlag']
          }
        }
        // TODO 分发action，更新用户应用数据
        // 分发mutations，更新用户应用数据
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
          ..._t.appData,
          iconList: iconList
        })
      },
      // 计算格子数据
      handlerGrids: function () {
        let _t = this
        // 1.通过窗口宽高、格子宽高，计算格子坐标
        let gridArr = []
        // 处理宽高
        let height = document.body.clientHeight
        let width = document.body.clientWidth
        console.log('height', height, 'width', width)
        // 每个图标宽高80px margin 10px
        let itemWidthHeight = 100
        let xNum = Math.floor(width / itemWidthHeight)
        let yNum = Math.floor(height / itemWidthHeight)
        console.log('xNum', xNum, 'yNum', yNum)
        // 从上到下，从左到右
        for (let i = 0; i < xNum; i++) {
          for (let j = 0; j < yNum; j++) {
            let item = {
              leftTop: {
                x: i * itemWidthHeight,
                y: j * itemWidthHeight
              },
              rightBottom: {
                x: (i + 1) * itemWidthHeight,
                y: (j + 1) * itemWidthHeight
              }
            }
            // console.log('leftTop', item.leftTop.x, item.leftTop.y, 'rightBottom', item.rightBottom.x, item.rightBottom.y)
            gridArr.push(item)
          }
        }
        // console.log('gridArr', gridArr)
        _t.gridArr = gridArr
      }
    },
    created: function () {
      let _t = this
      // 计算格子数据
      _t.handlerGrids()
      // 监听窗口大小调整
      window.onresize = () => {
        return (() => {
          console.log('window resize!')
          // 计算格子数据
          _t.handlerGrids()
          // FIXME 还需要从新计算图标位置
        })()
      }
    }
  }
</script>
