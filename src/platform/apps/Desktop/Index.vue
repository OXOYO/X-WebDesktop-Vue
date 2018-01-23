/**
* Created by OXOYO on 2017/12/24.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-desktop {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;

    .app-desktop-box {
      display: inline-block;
      /*position: relative;*/
      width: 100%;
      height: 100%;
      writing-mode: vertical-lr;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2000;
    }
  }
</style>

<template>
  <div class="app-desktop">
    <div
      class="app-desktop-box"
      @drop.stop.prevent="handlerDrop"
      @dragover.stop.prevent
    >
      <component
        :is="childComponents.DesktopIcon"
        v-for="item in appData.iconList"
        :key="item.app.name"
        :info="item"
        :showTitle="appData.showTitle"
        :style="item.desktopIcon.style"
      ></component>
      <component :is="childComponents.DesktopWidget"></component>
      <component
        :is="childComponents.Window"
        v-for="item in appData.iconList"
        v-if="item.window.status !=='close'"
        :key="item.app.name"
        :info="item"
      ></component>
      <component :is="childComponents.Wallpaper" :style="{ 'z-index': 1000 }"></component>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Desktop',
    props: {
      childComponents: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        gridArr: [],
        iconList: [],
        directionArr: [
          'top-bottom-left-right',
          'top-bottom-right-left',
          'bottom-top-left-right',
          'bottom-top-right-left',
          'left-right-top-bottom',
          'left-right-bottom-top',
          'right-left-top-bottom',
          'right-left-bottom-top'
        ],
        // 当前激活的排序方向
        currentDirection: 'top-bottom-left-right'
      }
    },
    computed: {
      ...mapState('Platform/Admin', {
        appData: state => state.appData,
        _appData: state => state._appData
      })
    },
    methods: {
      // 处理iconList
      handlerIconList: function (iconList) {
        let _t = this
        let flag = true
        for (let item of iconList) {
          let xVal = 0
          let yVal = 0
          let firstGrid = _t.gridArr[0][0]
          // FIXME 取中心点坐标
          xVal = (firstGrid.rightBottom.x - firstGrid.leftTop.x) / 2 + firstGrid.leftTop.x
          yVal = (firstGrid.rightBottom.y - firstGrid.leftTop.y) / 2 + firstGrid.leftTop.y

          let distanceArr = _t.handlerDistanceToGrid(xVal, yVal)
          let distanceArrBack = [...distanceArr]
          if (flag) {
            flag = false
          }
          // 目标Grid，FIXME 【BUG】此处需要考虑从上到下，从左到有的排布规则
          let targetGrid = _t.findGridForAuto(distanceArr, distanceArrBack)
          // 更新style
          let style = {
            'left': targetGrid.leftTop.x + 'px',
            'top': targetGrid.leftTop.y + 'px'
          }
          for (let i = 0, len = iconList.length; i < len; i++) {
            if (iconList[i].app.name === item.app.name) {
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
        switch (targetInfo.target) {
          case 'DesktopIcon':
            _t.handlerDesktopIconDrop(targetInfo, event)
            break
          case 'Window':
            _t.handlerWindowDrop(targetInfo, event)
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
        // 更新style
        let style = {
          'left': targetGrid.leftTop.x + 'px',
          'top': targetGrid.leftTop.y + 'px'
        }
//        let iconList = [..._t.iconList]
        let iconList = [..._t.appData.iconList]
        for (let i = 0, len = iconList.length; i < len; i++) {
          if (iconList[i].app.name === targetData.name) {
            iconList[i]['desktopIcon']['style'] = style
          }
        }
//        _t.iconList = [...iconList]
        // TODO 分发action，更新用户应用数据
        // 分发mutations，更新用户应用数据
        console.log('Admin/appData/set 001')
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
          ..._t.appData,
          iconList: iconList
        })
      },
      // 处理窗口drop
      handlerWindowDrop: function (targetInfo) {
        let _t = this
        let targetData = targetInfo.data || {}
        // 健壮，防止空数据
        if (!Object.keys(targetData).length) {
          return
        }
        // 1.计算 icon drop 时的坐标
        let xVal = event.clientX - targetData.offsetX
        let yVal = event.clientY - targetData.offsetY
        let style = {
          'margin-left': 0,
          'margin-top': 0,
          'left': xVal + 'px',
          'top': yVal + 'px'
        }
//        let iconList = [..._t.iconList]
        let iconList = [..._t.appData.iconList]
        for (let i = 0, len = iconList.length; i < len; i++) {
          let item = iconList[i]
          if (item.app.name === targetData.name) {
            iconList[i]['window']['style'] = {
              ...iconList[i]['window']['style'],
              ...style
            }
            break
          }
        }
//        _t.iconList = [...iconList]
        // 分发mutations，更新用户应用数据
        let appData = JSON.parse(JSON.stringify({
          ..._t.appData,
          iconList: iconList
        }))
        console.log('Admin/appData/set 002')
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), appData)
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
        // 每个图标宽高80px margin 10px
        let itemWidthHeight = 100
        let xNum = Math.floor(width / itemWidthHeight)
        let yNum = Math.floor(height / itemWidthHeight)
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
      handlerGridLayout: function (direction) {
        let _t = this
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
        if (!_t.directionArr.includes(direction)) {
          direction = _t.directionArr[0]
        }
        // 更新当前激活的排序方向
        _t.currentDirection = direction
        // 计算格子数据
        _t.handlerGrids(direction)
        _t.$nextTick(function () {
          // 处理iconList
//          _t.iconList = _t.handlerIconList([..._t.appData.iconList])
          let iconList = _t.handlerIconList([..._t.appData.iconList])
          // 分发mutations，更新用户应用数据
          console.log('Admin/appData/set 003')
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
        })
      },
      // 处理窗口层级改变
      handleWindowZIndexChange: function (appInfo) {
        let _t = this
//        let iconList = [..._t.iconList]
        let iconList = [..._t.appData.iconList]
        // 处理窗口层级变化
        iconList = _t.doWindowZIndexChange(iconList, appInfo)
//        _t.iconList = [...iconList]
        console.log('Admin/appData/set 004')
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
          ..._t.appData,
          iconList: iconList
        })
      },
      // 处理窗口层级变化
      doWindowZIndexChange: function (iconList, appInfo) {
        // 默认 z-index 为 2000
        let defZIndex = 2000
        let tmpArr = []
        // 先计算打开的窗口的数量
        let indexArr = []
        for (let i = 0, len = iconList.length; i < len; i++) {
          let item = iconList[i]
          if (item.window.status === 'open') {
            tmpArr.push(item.app.name)
            indexArr.push(i)
          }
        }
        // 处理当前窗口
        for (let j = 0, len = iconList.length; j < len; j++) {
          let item = iconList[j]
          let computedZIndex = defZIndex
          if (item.window.status === 'open') {
            // FIXME 只需要处理打开的窗口
            if (item.app.name === appInfo.app.name) {
              computedZIndex = defZIndex + tmpArr.length - 1
              // 移除已处理的窗口
              tmpArr = tmpArr.filter(item => item !== appInfo.app.name)
            } else {
              // 重置为默认层级
              computedZIndex = defZIndex
            }
            iconList[j]['window']['style']['z-index'] = computedZIndex
          }
        }
        // 处理其他窗口的层级
        if (tmpArr.length) {
          for (let k = 0, len = iconList.length; k < len; k++) {
            let item = iconList[k]
            let computedZIndex = defZIndex
            if (tmpArr.includes(item.app.name)) {
              computedZIndex = defZIndex + tmpArr.indexOf(item.app.name)
              iconList[k]['window']['style']['z-index'] = computedZIndex
            }
          }
        }
        return iconList
      },
      // 处理窗口大小改变
      handleWindowSizeChange: function (tmpInfo) {
        let _t = this
        let {appInfo, ...sizeInfo} = tmpInfo

        let iconList = [..._t.appData.iconList]
        for (let i = 0, len = iconList.length; i < len; i++) {
          let item = iconList[i]
          if (item.app.name === appInfo.app.name) {
            if (sizeInfo) {
              if (sizeInfo.actionName === 'close') {
                iconList[i]['window']['status'] = 'close'
                iconList[i]['window']['size'] = sizeInfo.newSize
                iconList[i]['window']['style'] = sizeInfo.newStyle || {}
                break
              } else {
                iconList[i]['window']['status'] = 'open'
                iconList[i]['window']['size'] = sizeInfo.newSize || ''
                iconList[i]['window']['oldSize'] = sizeInfo.oldSize || ''
                iconList[i]['window']['style'] = sizeInfo.newStyle || {}
                iconList[i]['window']['oldStyle'] = sizeInfo.oldStyle || {}
                if (sizeInfo.actionName === 'min') {
                  let taskBarList = []
                  for (let j = 0, length = iconList.length; j < length; j++) {
                    let appItem = iconList[j]
                    if (appItem.window.status === 'open' || appItem.taskBar.isPinned) {
                      taskBarList.push(appItem.app.name)
                    }
                  }
                  if (taskBarList.length) {
                    let taskBarIndex = taskBarList.indexOf(appInfo.app.name)
                    // FIXME 每个任务栏图标实际宽度 68px
                    iconList[i]['window']['style'] = {
                      ...iconList[i]['window']['style'],
                      left: 68 * (taskBarIndex + 1) + 'px'
                    }
                  }
                }
                break
              }
            }
          }
        }
        // 处理窗口层级变化
        iconList = _t.doWindowZIndexChange(iconList, appInfo)
        // 分发mutation，更新数据
        console.log('Admin/appData/set 005')
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
          ..._t.appData,
          iconList: iconList
        })
      },
      // 处理窗口打开
      handleWindowOpen: function (appInfo) {
        let _t = this
        // 查找备份数据
        let _appData = JSON.parse(JSON.stringify(_t._appData))
        let _appInfo
        for (let i = 0, len = _appData.iconList.length; i < len; i++) {
          let item = _appData.iconList[i]
          if (item.app.name === appInfo.app.name) {
            _appInfo = item
          }
        }
        let tmpObj
        // 判断当前应用窗口是否已打开
        if (appInfo.window.status === 'open') {
          console.log('appInfo.window.size', appInfo.window.size)
          if (appInfo.window.size === 'min') {
            tmpObj = {
              appInfo: appInfo,
              actionName: 'open',
              newSize: appInfo.window.oldSize || _appInfo.window.size,
              oldSize: '',
              newStyle: appInfo.window.oldStyle,
              oldStyle: {},
              status: 'open'
            }
          } else {
            tmpObj = {
              appInfo: appInfo,
              actionName: 'open',
              newSize: appInfo.window.oldSize || _appInfo.window.size,
              oldSize: appInfo.window.size,
              newStyle: appInfo.window.oldStyle || _appInfo.window.style,
              oldStyle: appInfo.window.oldStyle,
              status: 'open'
            }
          }
//          tmpObj = {
//            appInfo: _appInfo,
//            actionName: 'open',
//            newSize: appInfo.window.oldSize,
//            oldSize: _appInfo.window.size,
//            newStyle: Object.keys(appInfo.window.oldStyle).length,
//            oldStyle: _appInfo.window.style,
//            status: 'open'
//          }
        } else if (appInfo.window.status === 'close') {
          tmpObj = {
            appInfo: _appInfo,
            actionName: 'open',
            newSize: _appInfo.window.size,
            oldSize: '',
            newStyle: _appInfo.window.style,
            oldStyle: '',
            status: 'open'
          }
        }
        // 处理窗口大小改变
        console.log('handleWindowSizeChange 001')
        _t.handleWindowSizeChange(tmpObj)
      },
      // 处理窗口toggle
      handleWindowToggle: function (appInfo) {
        let _t = this
        // 查找备份数据
        let _appData = JSON.parse(JSON.stringify(_t._appData))
        let _appInfo
        for (let i = 0, len = _appData.iconList.length; i < len; i++) {
          let item = _appData.iconList[i]
          if (item.app.name === appInfo.app.name) {
            _appInfo = item
          }
        }
        let tmpObj
        // 判断当前应用窗口是否已打开
        if (appInfo.window.status === 'open') {
          if (appInfo.window.size === 'min') {
            tmpObj = {
              appInfo: appInfo,
              actionName: 'open',
              newSize: appInfo.window.oldSize || _appInfo.window.size,
              oldSize: '',
              newStyle: appInfo.window.oldStyle,
              oldStyle: {},
              status: 'open'
            }
          } else {
            tmpObj = {
              appInfo: appInfo,
              actionName: 'min',
              newSize: 'min',
              oldSize: appInfo.window.size,
              newStyle: {},
              oldStyle: appInfo.window.style,
              status: 'open'
            }
          }
        } else if (appInfo.window.status === 'close') {
          tmpObj = {
            appInfo: appInfo,
            actionName: 'open',
            newSize: _appInfo.window.size,
            oldSize: '',
            newStyle: _appInfo.window.style,
            oldStyle: '',
            status: 'open'
          }
        }
        // 处理窗口大小改变
        console.log('handleWindowSizeChange 002')
        _t.handleWindowSizeChange(tmpObj)
      },
      // 处理窗口位置变化
      handleWindowPositionChange: function (tmpInfo) {
        let _t = this
        let {appInfo, ...positionInfo} = tmpInfo
        let iconList = [..._t.appData.iconList]
        for (let i = 0, len = iconList.length; i < len; i++) {
          let item = iconList[i]
          if (item.app.name === appInfo.app.name) {
            iconList[i]['window']['style']['left'] = parseInt(positionInfo.x) + 'px'
            iconList[i]['window']['style']['top'] = parseInt(positionInfo.y) + 'px'
          }
        }
        // 分发mutation，更新数据
        console.log('Admin/appData/set 006')
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
          ..._t.appData,
          iconList: iconList
        })
      },
      // 处理窗口样式变化
      handleWindowStyleChange: function (appInfo) {
        let _t = this
        let iconList = [..._t.appData.iconList]
        for (let i = 0, len = iconList.length; i < len; i++) {
          let item = iconList[i]
          if (item.app.name === appInfo.app.name) {
            iconList[i] = appInfo
          }
        }
        // 分发mutation，更新数据
        console.log('Admin/appData/set 007')
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
          ..._t.appData,
          iconList: iconList
        })
      }
    },
    created: function () {
      let _t = this
      // 处理格子排序
      _t.handlerGridLayout(_t.currentDirection)

      // 监听事件
      _t.$utils.bus.$on('platform/desktopIcon/sort', function (direction) {
        if (_t.directionArr.includes(direction)) {
          // 处理格子排序
          _t.handlerGridLayout(direction)
        }
      })
      // 监听 window 层级改变
      _t.$utils.bus.$on('platform/window/zIndex/change', function (appInfo) {
        if (appInfo) {
          // 处理窗口层级改变
          _t.handleWindowZIndexChange(appInfo)
        }
      })
      // 监听 window 大小改变
      _t.$utils.bus.$on('platform/window/size/change', function (tmpInfo) {
        if (tmpInfo) {
          // 处理窗口大小改变
          console.log('handleWindowSizeChange 003')
          _t.handleWindowSizeChange(tmpInfo)
        }
      })
      // 监听 window 打开
      _t.$utils.bus.$on('platform/window/open', function (appInfo) {
        if (appInfo) {
          // 处理窗口大小改变
          _t.handleWindowOpen(appInfo)
        }
      })
      // 监听 window toggle
      _t.$utils.bus.$on('platform/window/toggle', function (appInfo) {
        if (appInfo) {
          // 处理窗口大小改变
          _t.handleWindowToggle(appInfo)
        }
      })
      // 监听 window 位置变化
      _t.$utils.bus.$on('platform/window/position/change', function (tmpInfo) {
        if (tmpInfo) {
          // 处理窗口位置改变
          _t.handleWindowPositionChange(tmpInfo)
        }
      })
      // 监听 window 样式变化
      _t.$utils.bus.$on('platform/window/style/change', function (appInfo) {
        if (appInfo) {
          // 处理窗口位置改变
          _t.handleWindowStyleChange(appInfo)
        }
      })
      let resizeTimer = null
      // 监听窗口大小调整
      window.onresize = () => {
        return (() => {
          if (resizeTimer) {
            clearTimeout(resizeTimer)
          }
          resizeTimer = setTimeout(function () {
            console.log('window resize!')
            // 处理格子排序
            _t.handlerGridLayout(_t.currentDirection)
          }, 500)
        })()
      }
    },
    beforeDestroy: function () {
      let _t = this
      _t.$utils.bus.$off([
        'platform/desktopIcon/sort',
        'platform/window/zIndex/change',
        'platform/window/size/change',
        'platform/window/open',
        'platform/window/toggle',
        'platform/window/position/change',
        'platform/window/style/change'
      ])
    }
  }
</script>
