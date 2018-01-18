/**
 * Created by OXOYO on 2018/1/17.
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
      let _t = dragConfig['context']
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
          done: 'x-drag-done',
          // 主样式，用于防止行内样式污染
          main: 'x-drag'
        },
        bus: dragConfig['bus'] || null
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
        event = event || window.event
        if (event.stopPropagation) {
          event.stopPropagation()
        }
        dragInfo.flag = true
        // 添加class
        target.classList.add(dragInfo.className.start, dragInfo.className.main)
        let leftVal = getStyle(target, 'left')
        let topVal = getStyle(target, 'top')
        dragInfo.left = parseInt(leftVal)
        dragInfo.top = parseInt(topVal)
        dragInfo.currentX = event.clientX
        dragInfo.currentY = event.clientY
        // 广播事件
        if (_t && dragInfo.bus && dragInfo.bus.start) {
          _t.$utils.bus.$emit(dragInfo.bus.start, {
            x: dragInfo.currentX,
            y: dragInfo.currentY
          })
        }
        console.log('xxxxxxx')
      }
      document.onmouseup = function (event) {
        console.log('fffffffffff')
        event = event || window.event
        // if (event.stopPropagation) {
        //   event.stopPropagation()
        // }
        dragInfo.flag = false
        let leftVal = getStyle(target, 'left')
        let topVal = getStyle(target, 'top')
        dragInfo.left = parseInt(leftVal)
        dragInfo.top = parseInt(topVal)
        target.classList.remove(dragInfo.className.start, dragInfo.className.move, dragInfo.className.done, dragInfo.className.main)
        console.log('target.classList', target.classList)
        // 广播事件
        if (_t && dragInfo.bus && dragInfo.bus.done) {
          // 重置样式
          target.style.left = 'none'
          target.style.top = 'none'
          _t.$utils.bus.$emit(dragInfo.bus.done, {
            x: dragInfo.left,
            y: dragInfo.top
          })
        }
      }
      document.onmousemove = function (event) {
        console.log('jjjjjjjjjj')
        event = event || window.event
        // if (event.stopPropagation) {
        //   event.stopPropagation()
        // }
        if (dragInfo.flag) {
          console.log('iiiiiiiiiiiiiiiii')
          target.classList.remove(dragInfo.className.start, dragInfo.className.main)
          target.classList.add(dragInfo.className.move)
          let disX = event.clientX - dragInfo.currentX
          let disY = event.clientY - dragInfo.currentY
          target.style.left = dragInfo.left + disX + 'px'
          target.style.top = dragInfo.top + disY + 'px'

          // 广播事件
          if (_t && dragInfo.bus && dragInfo.bus.move) {
            _t.$utils.bus.$emit(dragInfo.bus.move, {
              x: target.style.left,
              y: target.style.top
            })
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
