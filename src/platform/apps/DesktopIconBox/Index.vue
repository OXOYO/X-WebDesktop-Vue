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

    &:hover {
      background: rgba(0, 0, 0, .5);
    }

    &.grid-item-first {
      background: #339966;
    }

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
    <Button
      style="position: absolute; top: 120px; left: 350px; z-index: 999;"
      type="primary"
      v-show="isShowGrid"
      @click="handlerGridLayout"
    >
      Toggle {{ toggleType }}
    </Button>
    <!-- FIXME grid列表，调试用，后期可删除 -->
    <template
      v-for="(childArr, childIndex) in gridArr"
    >
      <div
        class="grid-item"
        :class="{ 'grid-item-first': childIndex === 0  || ( childIndex === 1 && index < 5) }"
        v-if="isShowGrid"
        v-for="(item, index) in childArr"
        :key="toggleType + '_' + childIndex + '_' + index"
        :style="{ left: item.leftTop.x + 'px', top: item.leftTop.y + 'px' }"
      >
        <div class="grid-item-label">{{ childIndex * childArr.length + index + 1 }}</div>
        <div class="grid-item-label">
          LT: {{ item.leftTop.x + ', ' + item.leftTop.y }}
        </div>
        <div class="grid-item-label">
          RB: {{ item.rightBottom.x + ', ' + item.rightBottom.y }}
        </div>
      </div>
    </template>
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
        isShowGrid: true,
        toggleIndex: 0,
        toggleType: 'top-bottom-left-right',
        iconList: []
      }
    },
    computed: {
      ...mapState('Platform/Admin', {
        appData: state => state.appData
      })
//      ,
//      iconList: function () {
//        let _t = this
//        // 处理iconList
//        console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
//        let iconList = [..._t.appData.iconList]
//        iconList = _t.handlerIconList(iconList)
//        return iconList
//      }
    },
    methods: {
      // 处理iconList
      handlerIconList: function (iconList) {
        let _t = this
        let flag = true
        for (let item of iconList) {
          let xVal = 0
          let yVal = 0
          let leftVal = parseFloat(item.desktopIcon.style.left)
          let topVal = parseFloat(item.desktopIcon.style.top)
          console.log('leftVal', leftVal, 'topVal', topVal)
          let firstGrid = _t.gridArr[0][0]
          console.log('firstGrid', firstGrid.leftTop.x, firstGrid.leftTop.y)
          // FIXME 取中心点坐标
          xVal = (firstGrid.rightBottom.x - firstGrid.leftTop.x) / 2 + firstGrid.leftTop.x
          yVal = (firstGrid.rightBottom.y - firstGrid.leftTop.y) / 2 + firstGrid.leftTop.y
          console.log('xVal', xVal, 'yVal', yVal)

          let distanceArr = _t.handlerDistanceToGrid(xVal, yVal)
          let distanceArrBack = [...distanceArr]
          if (flag) {
            console.log('distanceArr', distanceArr)
            flag = false
          }
          // 目标Grid，FIXME 【BUG】此处需要考虑从上到下，从左到有的排布规则
          let targetGrid = _t.findGridForAuto(distanceArr, distanceArrBack)
          console.log('targetGrid', targetGrid.leftTop.x, targetGrid.leftTop.y)
          // 更新style
          let style = {
            'left': targetGrid.leftTop.x + 'px',
            'top': targetGrid.leftTop.y + 'px'
          }
          for (let i = 0, len = iconList.length; i < len; i++) {
            if (iconList[i].app.name === item.app.name) {
              console.log('handlerIconList style', i, item.app.name, item.app.title, style)
              iconList[i]['desktopIcon']['style'] = style
            }
          }
        }

        // TODO 分发action，更新用户应用数据
        // 分发mutations，更新用户应用数据
        // _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
        //   ..._t.appData,
        //   iconList: iconList
        // })
        return iconList
      },
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
        let distanceArr = _t.handlerDistanceToGrid(xVal, yVal)
        let distanceArrBack = [...distanceArr]
        // 目标Grid
        let appInfo = targetData.appInfo
        let targetGrid = _t.findGridForDrag(distanceArr, distanceArrBack, appInfo)
        console.log('handlerDesktopIconDrop targetGrid', targetGrid.leftTop.x, targetGrid.leftTop.y)
        // 更新style
        let style = {
          'left': targetGrid.leftTop.x + 'px',
          'top': targetGrid.leftTop.y + 'px'
        }
        let iconList = [..._t.iconList]
        console.log(iconList, style)
        for (let i = 0, len = iconList.length; i < len; i++) {
          if (iconList[i].app.name === targetData.name) {
            console.log('handlerDesktopIconDrop style', i, targetData.name, style)
            iconList[i]['desktopIcon']['style'] = style
          }
        }
//        _t.iconList = [...iconList]
        // TODO 分发action，更新用户应用数据
        // 分发mutations，更新用户应用数据
//        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
//          ..._t.appData,
//          iconList: iconList
//        })
      },
      // 计算格子数据
      handlerGrids: function (direction) {
        let _t = this
        direction = direction || 'top-bottom-left-right'
        // 默认从上往下，从左往右
        /*
         * 1.从上往下，从左往右 top-bottom-left-right
         * 2.从上往下，从右往左 top-bottom-right-left
         * 3.从下往上，从左往右 bottom-top-left-right
         * 4.从下往上，从右往左 bottom-top-right-left
         *
         * 5.从左往右，从上往下 left-right-top-bottom
         * 6.从左往右，从下往上 left-right-bottom-top
         * 7.从右往左，从上往下 right-left-top-bottom
         * 8.从右往左，从下往上 right-left-bottom-top
         * */
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
        switch (direction) {
          case 'top-bottom-left-right':
            // 从上往下，从左往右
            for (let i = 0; i < xNum; i++) {
              let yArr = []
              for (let j = 0; j < yNum; j++) {
                let item = {
                  leftTop: {
                    x: i * itemWidthHeight,
                    y: j * itemWidthHeight
                  },
                  rightBottom: {
                    x: (i + 1) * itemWidthHeight,
                    y: (j + 1) * itemWidthHeight
                  },
                  isOccupied: false
                }
                yArr.push(item)
              }
              gridArr.push(yArr)
            }
            break
          case 'top-bottom-right-left':
            // 从上往下，从右往左
            for (let i = xNum; i > 0; i--) {
              let yArr = []
              for (let j = 0; j < yNum; j++) {
                let item = {
                  leftTop: {
                    x: (i - 1) * itemWidthHeight,
                    y: j * itemWidthHeight
                  },
                  rightBottom: {
                    x: i * itemWidthHeight,
                    y: (j + 1) * itemWidthHeight
                  },
                  isOccupied: false
                }
                yArr.push(item)
              }
              gridArr.push(yArr)
            }
            break
          case 'bottom-top-left-right':
            // 从下往上，从左往右
            for (let i = 0; i < xNum; i++) {
              let yArr = []
              for (let j = yNum; j > 0; j--) {
                let item = {
                  leftTop: {
                    x: i * itemWidthHeight,
                    y: (j - 1) * itemWidthHeight
                  },
                  rightBottom: {
                    x: (i - 1) * itemWidthHeight,
                    y: j * itemWidthHeight
                  },
                  isOccupied: false
                }
                yArr.push(item)
              }
              gridArr.push(yArr)
            }
            break
          case 'bottom-top-right-left':
            // 从下往上，从右往左
            for (let i = xNum; i > 0; i--) {
              let yArr = []
              for (let j = yNum; j > 0; j--) {
                let item = {
                  leftTop: {
                    x: (i - 1) * itemWidthHeight,
                    y: (j - 1) * itemWidthHeight
                  },
                  rightBottom: {
                    x: i * itemWidthHeight,
                    y: j * itemWidthHeight
                  },
                  isOccupied: false
                }
                yArr.push(item)
              }
              gridArr.push(yArr)
            }
            break
          case 'left-right-top-bottom':
            // 从左往右，从上往下
            for (let j = 0; j < yNum; j++) {
              let xArr = []
              for (let i = 0; i < xNum; i++) {
                let item = {
                  leftTop: {
                    x: i * itemWidthHeight,
                    y: j * itemWidthHeight
                  },
                  rightBottom: {
                    x: (i + 1) * itemWidthHeight,
                    y: (j + 1) * itemWidthHeight
                  },
                  isOccupied: false
                }
                xArr.push(item)
              }
              gridArr.push(xArr)
            }
            break
          case 'left-right-bottom-top':
            // 从左往右，从下往上
            for (let j = yNum; j > 0; j--) {
              let xArr = []
              for (let i = 0; i < xNum; i++) {
                let item = {
                  leftTop: {
                    x: i * itemWidthHeight,
                    y: (j - 1) * itemWidthHeight
                  },
                  rightBottom: {
                    x: (i + 1) * itemWidthHeight,
                    y: j * itemWidthHeight
                  },
                  isOccupied: false
                }
                xArr.push(item)
              }
              gridArr.push(xArr)
            }
            break
          case 'right-left-top-bottom':
            // 从右往左，从上往下
            for (let j = 0; j < yNum; j++) {
              let xArr = []
              for (let i = xNum; i > 0; i--) {
                let item = {
                  leftTop: {
                    x: (i - 1) * itemWidthHeight,
                    y: j * itemWidthHeight
                  },
                  rightBottom: {
                    x: i * itemWidthHeight,
                    y: (j + 1) * itemWidthHeight
                  },
                  isOccupied: false
                }
                xArr.push(item)
              }
              gridArr.push(xArr)
            }
            break
          case 'right-left-bottom-top':
            // 从右往左，从下往上
            for (let j = yNum; j > 0; j--) {
              let xArr = []
              for (let i = xNum; i > 0; i--) {
                let item = {
                  leftTop: {
                    x: (i - 1) * itemWidthHeight,
                    y: (j - 1) * itemWidthHeight
                  },
                  rightBottom: {
                    x: i * itemWidthHeight,
                    y: j * itemWidthHeight
                  },
                  isOccupied: false
                }
                xArr.push(item)
              }
              gridArr.push(xArr)
            }
            break
        }

        console.log('gridArr', gridArr)
        _t.gridArr = gridArr
      },
      // 2.2.递归查找距离最小且未占用的grid FIXME 【BUG】此处需要考虑从上到下，从左到有的排布规则
      findGridForAuto: function (distanceArr, distanceArrBack) {
        let _t = this
        // 2.2.1.求距离最小值 FIXME 【注意】某些情况下会存在多个相等的最小距离
        let targetGrid
        for (let childIndex in distanceArr) {
          let childArr = distanceArr[childIndex]
          if (!childArr.length) {
            continue
          }
          let minDistance = Math.min(...childArr)
          let childItemIndex = distanceArrBack[childIndex].indexOf(minDistance)
          targetGrid = _t.gridArr[childIndex][childItemIndex]
          // 判断是否占用
          if (targetGrid) {
            if (targetGrid.isOccupied) {
              // 过滤调已占用的距离
              let filterFlag = true
              let tmpArr = distanceArr[childIndex].filter(item => {
                if (item !== minDistance) {
                  return true
                } else {
                  if (filterFlag) {
                    filterFlag = false
                    return false
                  } else {
                    return true
                  }
                }
              })
              distanceArr[childIndex] = tmpArr
              targetGrid = _t.findGridForAuto(distanceArr, distanceArrBack)
              if (targetGrid) {
                break
              } else {
                continue
              }
            } else {
              // 标记targetGrid占用
              _t.gridArr[childIndex][childItemIndex]['isOccupied'] = true
              break
            }
          }
        }
        return targetGrid
      },
      findGridForDrag: function (distanceArr, distanceArrBack, appInfo) {
        let _t = this
        // 2.2.1.求距离最小值 FIXME 【注意】某些情况下会存在多个相等的最小距离
        let targetGrid
        // 获取最小距离数组
        let minDistanceArr = []
        for (let childArr of distanceArr) {
          minDistanceArr.push(Math.min(...childArr))
        }
        let minDistance = Math.min(...minDistanceArr)
        let childIndex = minDistanceArr.indexOf(minDistance)
        let childItemIndex = distanceArr[childIndex].indexOf(minDistance)
        targetGrid = _t.gridArr[childIndex][childItemIndex]
        // 判断是否占用
        if (targetGrid) {
          // 如果占用则递归
          if (targetGrid.isOccupied) {
            // 过滤调已占用的距离
            let filterFlag = true
            let tmpArr = distanceArr[childIndex].filter(item => {
              if (item !== minDistance) {
                return true
              } else {
                if (filterFlag) {
                  filterFlag = false
                  return false
                } else {
                  return true
                }
              }
            })
            distanceArr[childIndex] = tmpArr
            targetGrid = _t.findGridForDrag(distanceArr, distanceArrBack, appInfo)
          } else {
            // 标记targetGrid占用
            _t.gridArr[childIndex][childItemIndex]['isOccupied'] = true
            // 解除之前的grid占用
            console.log('appInfo', appInfo)
            let leftVal = parseFloat(appInfo.desktopIcon.style.left)
            let topVal = parseFloat(appInfo.desktopIcon.style.top)
            for (let childIndex in _t.gridArr) {
              let childArr = _t.gridArr[childIndex]
              for (let childItemIndex in childArr) {
                let childItem = _t.gridArr[childIndex][childItemIndex]
                if (childItem.leftTop.x === leftVal && childItem.leftTop.y === topVal) {
                  // 解除之前的grid占用
                  _t.gridArr[childIndex][childItemIndex]['isOccupied'] = false
                  break
                }
              }
            }
          }
        }
        return targetGrid
      },
      // 计算与各个grid的距离
      handlerDistanceToGrid: function (xVal, yVal) {
        let _t = this
        let distanceArr = []
        for (let childArr of _t.gridArr) {
          let distanceChildArr = []
          for (let item of childArr) {
            let distanceLeftTop = Math.sqrt(Math.pow(yVal - item.leftTop.y, 2) + Math.pow(xVal - item.leftTop.x, 2))
            let distanceRightBottom = Math.sqrt(Math.pow(yVal - item.rightBottom.y, 2) + Math.pow(xVal - item.rightBottom.x, 2))
            distanceChildArr.push(distanceLeftTop + distanceRightBottom)
          }
          distanceArr.push(distanceChildArr)
        }
        return distanceArr
      },
      handlerGridLayout: function () {
        let _t = this
        let arr = [
          'top-bottom-left-right',
          'top-bottom-right-left',
          'bottom-top-left-right',
          'bottom-top-right-left',
          'left-right-top-bottom',
          'left-right-bottom-top',
          'right-left-top-bottom',
          'right-left-bottom-top'
        ]
        _t.toggleType = arr[_t.toggleIndex]
        console.log('_t.toggleType', _t.toggleType)
        _t.handlerGrids(arr[_t.toggleIndex])
        _t.toggleIndex = _t.toggleIndex + 1 < arr.length ? _t.toggleIndex + 1 : 0
        _t.$nextTick(function () {
          // 处理iconList
          _t.iconList = _t.handlerIconList([..._t.appData.iconList])
        })
      }
    },
    created: function () {
      let _t = this
      // 计算格子数据
      /*
       * 1.从上往下，从左往右 top-bottom-left-right
       * 2.从上往下，从右往左 top-bottom-right-left
       * 3.从下往上，从左往右 bottom-top-left-right
       * 4.从下往上，从右往左 bottom-top-right-left
       *
       * 5.从左往右，从上往下 left-right-top-bottom
       * 6.从左往右，从下往上 left-right-bottom-top
       * 7.从右往左，从上往下 right-left-top-bottom
       * 8.从右往左，从下往上 right-left-bottom-top
       * */
      _t.handlerGridLayout()

      // 监听窗口大小调整
      window.onresize = () => {
        return (() => {
          console.log('window resize!')
          // 计算格子数据
          _t.handlerGrids('top-bottom-left-right')
          // FIXME 还需要从新计算图标位置
          // _t.handlerIconList(_t.iconList)
        })()
      }
    }
  }
</script>
