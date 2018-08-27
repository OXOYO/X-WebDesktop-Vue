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
      @drop.stop.prevent="handleDrop"
      @dragover.stop.prevent
    >
      <component
        :is="childComponents.DesktopIcon"
        v-for="item in appData.iconList"
        v-if="item.action !== 'install' || (item.action === 'install' && item.installed)"
        :key="item.app_name || item.config.app.name"
        :info="item"
        :showTitle="appData.showTitle"
        :style="item.config.desktopIcon.style"
      ></component>
      <component :is="childComponents.DesktopWidget"></component>
      <component
        :is="childComponents.Window"
        v-for="item in openedWindowList"
        :key="item.app_name || item.config.app.name"
        :info="item"
      ></component>
      <component :is="childComponents.Wallpaper" :style="{ 'z-index': 1000 }"></component>
      <!-- 分屏组件 -->
      <component :is="childComponents.SplitScreen" :data="splitScreenData"></component>
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
        // 每个图标宽高80px margin 10px
        itemWidthHeight: 100,
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
        currentDirection: 'top-bottom-left-right',
        // 通过行内样式控制
        windowStyleBySize: {
          small: {
            width: '300px',
            height: '200px',
            left: 'calc(50% - 150px)',
            top: 'calc(50% - 100px)'
//            ,
//            'margin-left': '-150px',
//            'margin-top': '-100px'
          },
          middle: {
            width: '800px',
            height: '600px',
            left: 'calc(50% - 400px)',
            top: 'calc(50% - 300px)'
//            ,
//            'margin-left': '-400px',
//            'margin-top': '-300px'
          },
          max: {
            width: 'auto',
            height: 'auto',
            left: 0,
            top: 0,
            right: 0,
            bottom: '42px'
          },
          min: {
            width: 0,
            height: 0,
            top: '100%'
          },
          custom: {}
        },
        // 预览样式
        previewStyle: {
          'z-index': '-1',
          position: 'absolute',
          display: 'inline-block',
          left: '50%',
          top: '50%',
          width: '800px',
          height: '600px',
          'margin-left': '-400px',
          'margin-top': '-300px'
        },
        // 分屏数据
        splitScreenData: {
          enable: false,
          // 分屏模式
          type: ''
        }
      }
    },
    computed: {
      ...mapState('Platform/Admin', {
        appData: state => state.appData,
        _appData: state => state._appData
      }),
      ...mapState('Platform', {
        userInfo: state => state.userInfo
      }),
      openedWindowList: function () {
        let _t = this
        let windowArr = _t.appData.iconList.filter(item => item.config.window.status !== 'close')
        return windowArr
      }
    },
    methods: {
      // 处理iconList
      handleIconList: function (iconList) {
        let _t = this
        let flag = true
        let firstGrid = _t.gridArr[0][0]
        for (let item of iconList) {
          let xVal = 0
          let yVal = 0
          // FIXME 取中心点坐标
          xVal = (firstGrid.rightBottom.x - firstGrid.leftTop.x) / 2 + firstGrid.leftTop.x
          yVal = (firstGrid.rightBottom.y - firstGrid.leftTop.y) / 2 + firstGrid.leftTop.y

          let distanceArr = _t.handleDistanceToGrid(xVal, yVal)
          let distanceArrBack = [...distanceArr]
          if (flag) {
            flag = false
          }
          // 目标Grid，FIXME 【BUG】此处需要考虑从上到下，从左到有的排布规则
          let targetGrid = _t.findGridForAuto(distanceArr, distanceArrBack)
          if (!targetGrid) {
            continue
          }
          // 更新style
          let style = {
            'left': targetGrid.leftTop.x + 'px',
            'top': targetGrid.leftTop.y + 'px'
          }
          for (let i = 0, len = iconList.length; i < len; i++) {
            if (iconList[i].config.app.name === item.config.app.name) {
              iconList[i].config.desktopIcon.style = style
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
      handleDrop: function (event) {
        let _t = this
        // 获取拖拽对象数据
        let targetInfo = JSON.parse(event.dataTransfer.getData('Text'))
        // TODO 判断target，根据target分别处理
        switch (targetInfo.target) {
          case 'DesktopIcon':
            _t.handleDesktopIconDrop(targetInfo, event)
            break
          case 'Window':
            _t.handleWindowDrop(targetInfo, event)
            break
        }
      },
      // 处理桌面图标drop
      handleDesktopIconDrop: function (targetInfo) {
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
        let distanceArr = _t.handleDistanceToGrid(xVal, yVal)
        let distanceArrBack = [...distanceArr]
        // 目标Grid
        let appInfo = targetData.appInfo
        let targetGrid = _t.findGridForDrag(distanceArr, distanceArrBack, appInfo)
        // 更新style
        let style = {
          'left': targetGrid.leftTop.x + 'px',
          'top': targetGrid.leftTop.y + 'px'
        }
        let iconList = [..._t.appData.iconList]
        for (let i = 0, len = iconList.length; i < len; i++) {
          if (iconList[i].config.app.name === targetData.name) {
            iconList[i].config.desktopIcon.style = style
          }
        }
        // TODO 分发action，更新用户应用数据
        // 分发mutations，更新用户应用数据
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
          ..._t.appData,
          iconList: iconList
        })
      },
      // 处理窗口drop
      handleWindowDrop: function (targetInfo) {
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
        let iconList = [..._t.appData.iconList]
        for (let i = 0, len = iconList.length; i < len; i++) {
          let item = iconList[i]
          if (item.config.app.name === targetData.name) {
            iconList[i].config.window.style = {
              ...iconList[i].config.window.style,
              ...style
            }
            break
          }
        }
        // 分发mutations，更新用户应用数据
        let appData = JSON.parse(JSON.stringify({
          ..._t.appData,
          iconList: iconList
        }))
        _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), appData)
      },
      // 计算格子数据
      handleGrids: function (direction) {
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
        // 每个图标宽高80px margin 10px
        let itemWidthHeight = _t.itemWidthHeight || 100
        // 处理宽高，保证存在最小宽高
        let height = document.body.clientHeight || itemWidthHeight
        let width = document.body.clientWidth || itemWidthHeight
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
            let leftVal = parseFloat(appInfo.config.desktopIcon.style.left)
            let topVal = parseFloat(appInfo.config.desktopIcon.style.top)
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
      handleDistanceToGrid: function (xVal, yVal) {
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
      handleGridLayout: function (direction) {
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
        _t.handleGrids(direction)
        _t.$nextTick(function () {
          // 处理iconList
          let iconList = _t.handleIconList([..._t.appData.iconList])
          // 分发mutations，更新用户应用数据
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
        })
      },
      handleWindowTrigger: function (tmpInfo, iconList) {
        let _t = this
        let {action, data} = tmpInfo
        iconList = iconList || [..._t.appData.iconList]
        console.log('handleWindowTrigger', 'action:', action, 'data:', data)
        // 查找单个索引
        let findAppIndex = function (iconList, condition) {
          return iconList.findIndex((item) => {
            return condition(item)
          })
        }
        // 查找所有符合条件的索引
        let findAllIndex = function (iconList, condition) {
          let tmpArr = []
          for (let i = 0, len = iconList.length; i < len; i++) {
            let item = iconList[i]
            if (condition(item)) {
              tmpArr.push(i)
            }
          }
          return tmpArr
        }
        // 处理已打开窗口层级
        let handleOpenedWindowZIndex = function (iconList, currentAppIndex) {
          let defZIndex = 2000
          // 查找已打开的window的index
          let openedWindowIndexArr = findAllIndex(iconList, (item) => item.config.window.status === 'open' && item.config.window.size !== 'min')
          // 处理z-index
          let len = openedWindowIndexArr.length
          if (len) {
            if (len === 1) {
              iconList[currentAppIndex].config['window']['style']['z-index'] = defZIndex
            } else {
              // 1.先处理当前打开的window，放到最大
              iconList[currentAppIndex].config['window']['style']['z-index'] = defZIndex + len - 1
              // 2.移除当前打开的window
              openedWindowIndexArr = openedWindowIndexArr.filter((_appIndex) => _appIndex !== currentAppIndex)
              // 3.再处理其他已打开的window
              for (let i = 0, len = openedWindowIndexArr.length, index; i < len; i++) {
                index = openedWindowIndexArr[i]
                iconList[index].config['window']['style']['z-index'] = defZIndex + i
              }
            }
          }
          return iconList
        }
        let handleOpenByTaskBarIcon = function (data) {
          // let timeNow = new Date().getTime()
          let appInfo = data.appInfo || {}
          if (!Object.keys(appInfo).length || !appInfo.config.window) {
            return
          }
          // 当前操作的窗口索引
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            return
          }
          let currentStyle = JSON.parse(JSON.stringify(iconList[currentAppIndex].config['window']['style'] || {}))
          let currentSize = iconList[currentAppIndex].config['window']['size']
          let oldStyle = JSON.parse(JSON.stringify(iconList[currentAppIndex].config['window']['oldStyle'] || {}))
          let oldSize = iconList[currentAppIndex].config['window']['oldSize']
          currentStyle = handleWindowMaxWidthHeight(currentStyle)
          oldStyle = handleWindowMaxWidthHeight(oldStyle)
          if (appInfo.config.window.status === 'close') {
            iconList[currentAppIndex].config['window']['status'] = 'open'
            if (currentSize !== 'custom') {
              iconList[currentAppIndex].config['window']['style'] = _t.windowStyleBySize[currentSize]
            } else {
              iconList[currentAppIndex].config['window']['style'] = currentStyle
            }
            // 处理窗口层级，将当前窗口层级更新到最大
            iconList = handleOpenedWindowZIndex(iconList, currentAppIndex)
          } else if (appInfo.config.window.status === 'open') {
            // 判断当前操作的窗口是否是最小化状态
            if (appInfo.config.window.size === 'min') {
              // 还原窗口
              iconList[currentAppIndex].config['window']['size'] = oldSize
              iconList[currentAppIndex].config['window']['style'] = {
                ...oldStyle
                // ,
                // ..._t.windowStyleBySize[iconList[currentAppIndex]['window']['size']]
              }
              // 处理窗口层级，将当前窗口层级更新到最大
              iconList = handleOpenedWindowZIndex(iconList, currentAppIndex)
            } else {
              // 备份旧style/size
              iconList[currentAppIndex].config['window']['oldStyle'] = currentStyle
              iconList[currentAppIndex].config['window']['oldSize'] = currentSize
              // 判断当前窗口层级是否最大，不是最大则切换到最大，是就最小化
              // 查找已打开的window的index
              let openedWindowIndexArr = findAllIndex(iconList, (item) => item.config.window.status === 'open' && item.config.window.size !== 'min')
              // 查找层级
              let zIndexArr = []
              for (let i = 0, len = openedWindowIndexArr.length, appIndex; i < len; i++) {
                appIndex = openedWindowIndexArr[i]
                zIndexArr.push(iconList[appIndex].config['window']['style']['z-index'])
              }
              // 最大层级
              let maxZIndex = Math.max(...zIndexArr)
              // 最大层级对应索引
              let maxZIndexIndex = zIndexArr.indexOf(maxZIndex)
              if (currentAppIndex === openedWindowIndexArr[maxZIndexIndex]) {
                // 将当前窗口最小化
                iconList[currentAppIndex].config['window']['style'] = _t.windowStyleBySize['min']
                iconList[currentAppIndex].config['window']['size'] = 'min'
                // 处理left值
                let taskBarList = findAllIndex(iconList, (item) => item.config.window.status === 'open' || item.config.taskBar.isPinned)
                if (taskBarList.length) {
                  let taskBarIndex = taskBarList.indexOf(currentAppIndex)
                  // FIXME 每个任务栏图标实际宽度 68px
                  iconList[currentAppIndex].config['window']['style'] = {
                    ...iconList[currentAppIndex].config['window']['style'],
                    left: 68 * (taskBarIndex + 1) + 'px'
                  }
                }
              } else {
                // 处理窗口层级，将当前窗口层级更新到最大
                iconList = handleOpenedWindowZIndex(iconList, currentAppIndex)
              }
            }
          }
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
        }
        let handleResizeByWindowBar = function (data) {
          let {appInfo, action} = data
          if (!Object.keys(appInfo).length || !appInfo.config.window) {
            return
          }
          // 回调操作
          let callback = null
          // 当前操作的窗口索引
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            return
          }
          let currentStyle = JSON.parse(JSON.stringify(iconList[currentAppIndex].config['window']['style'] || {}))
          let currentSize = iconList[currentAppIndex].config['window']['size']
          let oldStyle = JSON.parse(JSON.stringify(iconList[currentAppIndex].config['window']['oldStyle'] || {}))
          let oldSize = iconList[currentAppIndex].config['window']['oldSize']
          switch (action) {
            case 'min':
              // 备份旧style/size
              iconList[currentAppIndex].config['window']['oldStyle'] = currentStyle
              iconList[currentAppIndex].config['window']['oldSize'] = currentSize
              // 将当前窗口最小化
              iconList[currentAppIndex].config['window']['style'] = _t.windowStyleBySize['min']
              iconList[currentAppIndex].config['window']['size'] = 'min'
              // 处理left值
              let taskBarList = findAllIndex(iconList, (item) => item.config.window.status === 'open' || item.config.taskBar.isPinned)
              if (taskBarList.length) {
                let taskBarIndex = taskBarList.indexOf(currentAppIndex)
                // FIXME 每个任务栏图标实际宽度 68px
                iconList[currentAppIndex].config['window']['style'] = {
                  ...iconList[currentAppIndex].config['window']['style'],
                  left: 68 * (taskBarIndex + 1) + 'px'
                }
              }
              break
            case 'reset':
              // 备份旧style/size
              // 还原窗口旧样式
              if (oldSize === 'max') {
                iconList[currentAppIndex].config['window']['style'] = JSON.parse(JSON.stringify(_t._appData.iconList[currentAppIndex].config['window']['style'] || {}))
                iconList[currentAppIndex].config['window']['size'] = _t._appData.iconList[currentAppIndex].config['window']['size']
                iconList[currentAppIndex].config['window']['style'] = {
                  ...JSON.parse(JSON.stringify(iconList[currentAppIndex].config['window']['style'])),
                  ..._t.windowStyleBySize[iconList[currentAppIndex].config['window']['size']]
                }
              } else {
                iconList[currentAppIndex].config['window']['style'] = oldStyle
                iconList[currentAppIndex].config['window']['size'] = oldSize
              }
              // 备份旧style/size
              iconList[currentAppIndex].config['window']['oldStyle'] = currentStyle
              iconList[currentAppIndex].config['window']['oldSize'] = currentSize
              break
            case 'max':
              // 备份旧style/size
              iconList[currentAppIndex].config['window']['oldStyle'] = currentStyle
              iconList[currentAppIndex].config['window']['oldSize'] = currentSize
              // 将当前窗口最大化
              iconList[currentAppIndex].config['window']['style'] = {
                ...currentStyle,
                ..._t.windowStyleBySize['max']
              }
              iconList[currentAppIndex].config['window']['size'] = 'max'
              break
            case 'close':
              // 如果是安装/卸载窗口的关闭操作则从iconList中移除
              if (appInfo.hasOwnProperty('action') && ['install', 'uninstall'].includes(appInfo.action)) {
                if (appInfo.hasOwnProperty('installed') && appInfo.installed) {
                  iconList = iconList.map(item => {
                    if (item.config.app.name === appInfo.config.app.name) {
                      delete item.action
                      delete item.installed
                      let _itemIndex = findAppIndex(_t._appData.iconList, (item) => item.config.app.name === appInfo.config.app.name)
                      console.log('_itemIndex', _itemIndex)
                      let _item = _t._appData.iconList[_itemIndex]
                      item.config.window = {
                        ..._item.config.window
                      }
                    }
                    return item
                  })
                } else {
                  iconList = iconList.filter(item => item.config.app.name !== appInfo.config.app.name)
                }
                /*
                callback = () => {
                  _t.$nextTick(function () {
                    // 刷新用户应用列表
                    _t.$utils.bus.$emit('Admin/appData/refresh')
                  })
                }
                */
              } else {
                iconList[currentAppIndex].config['window']['status'] = 'close'
                // 初始化size/style
                iconList[currentAppIndex].config['window']['style'] = _t._appData.iconList[currentAppIndex] ? _t._appData.iconList[currentAppIndex].config['window']['style'] : {}
                iconList[currentAppIndex].config['window']['size'] = _t._appData.iconList[currentAppIndex] ? _t._appData.iconList[currentAppIndex].config['window']['size'] : ''
                iconList[currentAppIndex].config['window']['oldStyle'] = {}
                iconList[currentAppIndex].config['window']['oldSize'] = ''
              }
              break
          }
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
          callback && callback()
        }
        let handleZIndexChangeByWindow = function (data) {
          let appInfo = data.appInfo || {}
          if (!Object.keys(appInfo).length || !appInfo.config.window) {
            return
          }
          // 当前操作的窗口索引
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            return
          }
          // 处理窗口层级，将当前窗口层级更新到最大
          iconList = handleOpenedWindowZIndex(iconList, currentAppIndex)
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
        }
        let handleDragResize = function (data) {
          let appInfo = data.appInfo || {}
          if (!Object.keys(appInfo).length || !appInfo.config.window) {
            return
          }
          // 当前操作的窗口索引
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            return
          }
          iconList[currentAppIndex].config['window']['style'] = {
            ...iconList[currentAppIndex].config['window']['style'],
            ...appInfo.config['window']['style']
          }
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
        }
        let handlePreviewThumbShow = function (data) {
          let {appInfo, callback} = data
          if (!Object.keys(appInfo).length || !appInfo.config.window) {
            return
          }
          // 当前操作的窗口索引
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            return
          }
          iconList[currentAppIndex].config['window']['style'] = {
            ...iconList[currentAppIndex].config['window']['style'],
            ..._t.previewStyle
          }
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
          if (callback && typeof callback === 'function') {
            _t.$nextTick(function () {
              setTimeout(callback, 500)
            })
          }
        }
        let handlePreviewThumbHide = function (data) {
          let {appInfo} = data
          if (!Object.keys(appInfo).length || !appInfo.config.window) {
            return
          }
          // 当前操作的窗口索引
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            return
          }
          // 将当前窗口最小化
          iconList[currentAppIndex].config['window']['style'] = _t.windowStyleBySize['min']
          iconList[currentAppIndex].config['window']['size'] = 'min'
          // 处理left值
          let taskBarList = findAllIndex(iconList, (item) => item.config.window.status === 'open' || item.config.taskBar.isPinned)
          if (taskBarList.length) {
            let taskBarIndex = taskBarList.indexOf(currentAppIndex)
            // FIXME 每个任务栏图标实际宽度 68px
            iconList[currentAppIndex].config['window']['style'] = {
              ...iconList[currentAppIndex].config['window']['style'],
              left: 68 * (taskBarIndex + 1) + 'px'
            }
          }
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
        }
        let handleShowWindowByPreviewThumb = function (data) {
          let {appInfo} = data
          if (!Object.keys(appInfo).length || !appInfo.config.window) {
            return
          }
          // 当前操作的窗口索引
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            return
          }
          // 还原当前窗口
          let oldStyle = JSON.parse(JSON.stringify(iconList[currentAppIndex].config['window']['oldStyle'] || {}))
          let oldSize = iconList[currentAppIndex].config['window']['oldSize']
          iconList[currentAppIndex].config['window']['style'] = oldStyle
          iconList[currentAppIndex].config['window']['size'] = oldSize
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
        }
        let handleToggleWindowByContextMenu = function (data) {
          let {appInfo, action} = data
          if (!Object.keys(appInfo).length || !appInfo.config.window) {
            return
          }
          // 当前操作的窗口索引
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            return
          }
          console.log('currentAppIndex', currentAppIndex)
          let currentStyle = JSON.parse(JSON.stringify(iconList[currentAppIndex].config['window']['style'] || {}))
          let currentSize = iconList[currentAppIndex].config['window']['size']
          let oldStyle = JSON.parse(JSON.stringify(iconList[currentAppIndex].config['window']['oldStyle'] || {}))
          let oldSize = iconList[currentAppIndex].config['window']['oldSize']
          currentStyle = handleWindowMaxWidthHeight(currentStyle)
          oldStyle = handleWindowMaxWidthHeight(oldStyle)
          if (action === 'close') {
            iconList[currentAppIndex].config['window']['status'] = 'close'
            // 初始化size/style
            iconList[currentAppIndex].config['window']['style'] = _t._appData.iconList[currentAppIndex].config['window']['style']
            iconList[currentAppIndex].config['window']['size'] = _t._appData.iconList[currentAppIndex].config['window']['size']
            iconList[currentAppIndex].config['window']['oldStyle'] = {}
            iconList[currentAppIndex].config['window']['oldSize'] = ''
          } else if (action === 'open') {
            if (appInfo.config.window.status === 'close') {
              iconList[currentAppIndex].config['window']['status'] = 'open'
              if (currentSize !== 'custom') {
                iconList[currentAppIndex].config['window']['style'] = _t.windowStyleBySize[currentSize]
              } else {
                iconList[currentAppIndex].config['window']['style'] = currentStyle
              }
              // 处理窗口层级，将当前窗口层级更新到最大
              iconList = handleOpenedWindowZIndex(iconList, currentAppIndex)
            } else if (appInfo.config.window.status === 'open') {
              // 判断当前操作的窗口是否是最小化状态
              if (appInfo.config.window.size === 'min') {
                // 还原窗口
                iconList[currentAppIndex].config['window']['size'] = oldSize
                iconList[currentAppIndex].config['window']['style'] = {
                  ...oldStyle
                  // ,
                  // ..._t.windowStyleBySize[iconList[currentAppIndex]['window']['size']]
                }
                // 处理窗口层级，将当前窗口层级更新到最大
                iconList = handleOpenedWindowZIndex(iconList, currentAppIndex)
              } else {
                // 备份旧style/size
                iconList[currentAppIndex].config['window']['oldStyle'] = currentStyle
                iconList[currentAppIndex].config['window']['oldSize'] = currentSize
                // 判断当前窗口层级是否最大，不是最大则切换到最大，是就最小化
                // 查找已打开的window的index
                let openedWindowIndexArr = findAllIndex(iconList, (item) => item.config.window.status === 'open' && item.config.window.size !== 'min')
                // 查找层级
                let zIndexArr = []
                for (let i = 0, len = openedWindowIndexArr.length, appIndex; i < len; i++) {
                  appIndex = openedWindowIndexArr[i]
                  zIndexArr.push(iconList[appIndex].config['window']['style']['z-index'])
                }
                // 最大层级
                let maxZIndex = Math.max(...zIndexArr)
                // 最大层级对应索引
                let maxZIndexIndex = zIndexArr.indexOf(maxZIndex)
                if (currentAppIndex === openedWindowIndexArr[maxZIndexIndex]) {
                  // 将当前窗口最小化
                  iconList[currentAppIndex].config['window']['style'] = _t.windowStyleBySize['min']
                  iconList[currentAppIndex].config['window']['size'] = 'min'
                  // 处理left值
                  let taskBarList = findAllIndex(iconList, (item) => item.config.window.status === 'open' || item.config.taskBar.isPinned)
                  if (taskBarList.length) {
                    let taskBarIndex = taskBarList.indexOf(currentAppIndex)
                    // FIXME 每个任务栏图标实际宽度 68px
                    iconList[currentAppIndex].config['window']['style'] = {
                      ...iconList[currentAppIndex].config['window']['style'],
                      left: 68 * (taskBarIndex + 1) + 'px'
                    }
                  }
                } else {
                  // 处理窗口层级，将当前窗口层级更新到最大
                  iconList = handleOpenedWindowZIndex(iconList, currentAppIndex)
                }
              }
            }
          }
          _t.$store.commit(_t.$utils.store.getType('Admin/appData/set', 'Platform'), {
            ..._t.appData,
            iconList: iconList
          })
        }
        // 处理窗口max-widht && max-height
        let handleWindowMaxWidthHeight = function (style) {
          let bodyHeight = document.body.offsetHeight
          let bodyWidth = document.body.offsetWidth
          let maxHeight = Math.ceil(bodyHeight * 0.8)
          let top = Math.ceil(maxHeight / 2)
          let maxWidth = Math.ceil(bodyWidth * 0.8)
          let left = Math.ceil(maxWidth / 2)
          if (style.hasOwnProperty('height') && parseInt(style['height']) > maxHeight) {
            style.height = maxHeight + 'px'
            style.top = 'calc(50% - ' + top + 'px)'
          }
          if (style.hasOwnProperty('width') && parseInt(style.width) > maxWidth) {
            style.width = maxWidth + 'px'
            style.left = 'calc(50% - ' + left + 'px)'
          }
          return style
        }
        switch (action) {
          case 'openByStartMenuList':
          case 'openByDesktopIcon':
          case 'openByTaskBarIcon':
          case 'openByInstall':
          case 'openByUninstall':
            handleOpenByTaskBarIcon(data)
            break
          case 'resizeByWindowBar':
            handleResizeByWindowBar(data)
            break
          case 'zIndexChangeByWindow':
            handleZIndexChangeByWindow(data)
            break
          case 'dragResize':
            handleDragResize(data)
            break
          case 'previewThumbShow':
            handlePreviewThumbShow(data)
            break
          case 'previewThumbHide':
            handlePreviewThumbHide(data)
            break
          case 'showWindowByPreviewThumb':
            handleShowWindowByPreviewThumb(data)
            break
          case 'toggleWindowByContextMenu':
            handleToggleWindowByContextMenu(data)
            break
        }
      },
      // 处理应用安装/卸载
      handleAppInstallOrUninstall: function (tmpInfo) {
        let _t = this
        let appInfo = tmpInfo.data.appInfo
        console.log('appInfo', appInfo)
        // 打开安装/卸载界面
        let openWindow = function () {
          let iconList = [..._t.appData.iconList]
          // 查找单个索引
          let findAppIndex = function (iconList, condition) {
            return iconList.findIndex((item) => {
              return condition(item)
            })
          }
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            iconList.push(appInfo)
          } else {
            iconList[currentAppIndex] = appInfo
          }
          _t.handleWindowTrigger(tmpInfo, iconList)
        }
        console.log('tmpInfo.action', tmpInfo.action)
        // 根据当前操作执行不同逻辑
        switch (tmpInfo.action) {
          // 打开安装/卸载界面
          case 'openByInstall':
          case 'openByUninstall':
            openWindow()
            break
          // 执行安装
          case 'doInstall':
            _t.doApplicationInstall(appInfo, tmpInfo.data.callback)
            break
          // 执行卸载
          case 'doUninstall':
            _t.doApplicationUninstall(appInfo, tmpInfo.data.callback)
            break
        }
      },
      // 执行安装操作
      doApplicationInstall: async function (appInfo, callback) {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Platform/Desktop/application/install', {
          id: appInfo.appID
        })
        console.log('doApplicationInstall', res)
        if (!res || res.status !== 200) {
          // _t.$Message.error('安装失败！')
          callback && callback(false)
          return
        }
        _t.$Message.info(res.msg || '安装成功！')
        callback && callback(true, res.msg)
        /*
        _t.$nextTick(function () {
          // 刷新用户应用列表
          _t.$utils.bus.$emit('Admin/appData/refresh')
        })
        */
      },
      // 执行卸载操作
      doApplicationUninstall: async function (appInfo, callback) {
        let _t = this
        console.log('appInfo', appInfo)
        // 分发action，调接口
        let res = await _t.$store.dispatch('Platform/Desktop/application/uninstall', {
          // 用户应用列表索引ID
          id: appInfo.id,
          // 应用ID
          app_id: appInfo.app_id,
          // 用户ID
          user_id: _t.userInfo.id
        })
        console.log('doApplicationUninstall', res)
        if (!res || res.status !== 200) {
          // _t.$Message.error('卸载失败！')
          callback && callback(false)
          return
        }
        _t.$Message.info(res.msg || '安装成功！')
        callback && callback(true, res.msg)
        _t.$nextTick(function () {
          // 刷新用户应用列表
          _t.$utils.bus.$emit('Admin/appData/refresh')
        })
      },
      handleSplitScreen: function (tmpInfo) {
        let _t = this
        _t.splitScreenData = tmpInfo.data
      }
    },
    created: function () {
      let _t = this
      // 处理格子排序
      _t.handleGridLayout(_t.currentDirection)
      // 初始化渲染
      _t.$utils.bus.$on('platform/desktopIcon/render', function () {
        // 处理格子排序
        _t.handleGridLayout(_t.currentDirection)
      })
      // 监听事件
      _t.$utils.bus.$on('platform/desktopIcon/sort', function (direction) {
        if (_t.directionArr.includes(direction)) {
          // 处理格子排序
          _t.handleGridLayout(direction)
        }
      })
      // 监听 window 操作
      _t.$utils.bus.$on('platform/window/trigger', function (tmpInfo) {
        _t.handleWindowTrigger(tmpInfo)
      })
      // 监听 window 分屏
      _t.$utils.bus.$on('platform/window/splitScreen', function (tmpInfo) {
        _t.handleSplitScreen(tmpInfo)
      })
      // 监听应用安装
      _t.$utils.bus.$on('platform/application/install', function (tmpInfo) {
        _t.handleAppInstallOrUninstall(tmpInfo)
      })
      // 监听应用卸载
      _t.$utils.bus.$on('platform/application/uninstall', function (tmpInfo) {
        _t.handleAppInstallOrUninstall(tmpInfo)
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
            _t.handleGridLayout(_t.currentDirection)
          }, 500)
        })()
      }
    },
    beforeDestroy: function () {
      let _t = this
      _t.$utils.bus.$off([
        'platform/desktopIcon/sort'
      ])
    }
  }
</script>
