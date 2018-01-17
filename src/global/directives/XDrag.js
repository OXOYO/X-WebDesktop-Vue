/**
 * Created by yangfan9244 on 2018/1/17.
 */

const XDrag = {}

XDrag.installed = false
XDrag.install = function (Vue) {
  if (XDrag.installed) {
    return
  }

  Vue.directive('x-drag', {
    bind: function (el, binding) {
      console.log('binding', binding)
      let dragInfo = {
        flag: false,
        left: 0,
        top: 0,
        currentX: 0,
        currentY: 0,
        backStyle: {}
      }
      // 需要处理 bar target
      let target = el
      let getCss = function (target) {
        return target.currentStyle ? target.currentStyle : document.defaultView.getComputedStyle(target, null)
      }
      let getStyle = function (target, key) {
        return getCss(target)[key]
      }
      // 绑定事件
      el.onmousedown = function (event) {
        dragInfo.flag = true
        dragInfo.backStyle = getCss(el)
        console.log(dragInfo.backStyle)
        let leftVal = getStyle(el, 'left')
        let topVal = getStyle(el, 'top')

        dragInfo.left = parseInt(leftVal)
        dragInfo.top = parseInt(topVal)

        dragInfo.currentX = event.clientX
        dragInfo.currentY = event.clientY
        // target.style.transition = 'none'
      }
      document.onmouseup = function () {
        dragInfo.flag = false
        let leftVal = getStyle(el, 'left')
        let topVal = getStyle(el, 'top')
        let marginLeftVal = getStyle(el, 'margin-left')
        let marginTopVal = getStyle(el, 'margin-top')

        dragInfo.left = parseInt(leftVal) + parseInt(marginLeftVal)
        dragInfo.top = parseInt(topVal) + parseInt(marginTopVal)
        // target.style.transition = dragInfo.backStyle['transition']
      }
      document.onmousemove = function (event) {
        event = event || window.event
        if (dragInfo.flag) {
          let nowX = event.clientX
          let nowY = event.clientY
          let disX = nowX - dragInfo.currentX
          let disY = nowY - dragInfo.currentY
          target.style.left = parseInt(dragInfo.left) + disX + 'px'
          target.style.top = parseInt(dragInfo.top) + disY + 'px'

          if (event.preventDefault) {
            event.preventDefault()
          }
          return false
        }
      }
    }
  })
  XDrag.installed = true
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(XDrag)
}

module.exports = XDrag
