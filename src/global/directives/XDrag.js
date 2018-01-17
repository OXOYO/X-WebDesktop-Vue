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
      let dragConfig = binding.value || {}
      let dragInfo = {
        flag: false,
        left: 0,
        top: 0,
        currentX: 0,
        currentY: 0,
        bar: dragConfig['bar'] || null,
        className: {
          start: 'x-drag-start',
          move: 'x-drag-move',
          done: 'x-drag-done'
        }
      }
      // 处理className
      if (Object.keys(dragConfig).length) {
        if (dragConfig['className']) {
          dragInfo.className = {
            ...dragInfo.className,
            ...dragConfig.className
          }
        }
      }
      // 需要处理 bar target
      let target = el
      let bar = dragInfo.bar ? el.querySelector(dragInfo.bar) : el
      let getCss = function (element) {
        return element.currentStyle ? element.currentStyle : document.defaultView.getComputedStyle(element, null)
      }
      let getStyle = function (element, key) {
        return getCss(element)[key]
      }
      // 绑定事件
      bar.onmousedown = function (event) {
        dragInfo.flag = true
        // 添加class
        target.classList.add(dragInfo.className.start)
        let leftVal = getStyle(target, 'left')
        let topVal = getStyle(target, 'top')
        dragInfo.left = parseInt(leftVal)
        dragInfo.top = parseInt(topVal)
        dragInfo.currentX = event.clientX
        dragInfo.currentY = event.clientY
      }
      document.onmouseup = function () {
        dragInfo.flag = false
        let leftVal = getStyle(target, 'left')
        let topVal = getStyle(target, 'top')
        dragInfo.left = parseInt(leftVal)
        dragInfo.top = parseInt(topVal)
        target.classList.remove(dragInfo.className.start, dragInfo.className.move, dragInfo.className.done)
      }
      document.onmousemove = function (event) {
        event = event || window.event
        if (dragInfo.flag) {
          target.classList.remove(dragInfo.className.start)
          target.classList.add(dragInfo.className.move)
          let disX = event.clientX - dragInfo.currentX
          let disY = event.clientY - dragInfo.currentY
          target.style.left = dragInfo.left + disX + 'px'
          target.style.top = dragInfo.top + disY + 'px'

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

// module.exports = XDrag
export default XDrag
