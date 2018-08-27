/**
 * Created by OXOYO on 2018/1/19.
 */

const XDrag = {}

XDrag.installed = false
XDrag.install = function (Vue) {
  if (XDrag.installed) {
    return
  }
  Vue.directive('x-drag', {
    inserted: function (el, binding) {
      /*
      // config 配置结构参考
      config = {
        // 上下文，如需广播事件则必须
        context: _t,
        // 拖拽配置
        drag: {
          // 是否启用拖拽
          enable: true,
          // 指定拖拽把手元素，支持一个或多个把手
          handler: [],
          // 拖拽不同阶段 className
          class: {
            start: 'x-drag-start',
            move: 'x-drag-move',
            done: 'x-drag-done',
            main: 'x-drag'
          },
          // 回调
          callback: {
            start: null,
            move: null,
            done: (style) => {
              console.log('drag done', style)
            }
          },
          // 拖拽范围 类型：Object || Function
          range: {
            minX: 0,
            maxX: 500,
            minY: 0,
            maxY: 500,
          }
        },
        // 缩放配置
        resize: {
          // 是否启用拖拽
          enable: false,
          // 指定缩放把手元素，支持一个或多个把手
          handler: [],
          // 缩放不同阶段 className
          class: {
            start: 'x-resize-start',
            move: 'x-resize-move',
            done: 'x-resize-done',
            main: 'x-resize'
          },
          // 回调
          callback: {
            start: null,
            move: null,
            done: (style) => {
              console.log('resize done', style)
            }
          }
        }
      }
      */
      let getCss = function (element) {
        return element.currentStyle ? element.currentStyle : document.defaultView.getComputedStyle(element, null)
      }
      let getStyle = function (element, key) {
        return getCss(element)[key]
      }
      let config = binding.value || {}
      if (Object.keys(config).length) {
        // 处理拖拽
        if (config.drag && config.drag.enable) {
          // 处理 target
          let target = el
          // 处理函数
          let handler = function (target, bar) {
            let dragInfo = {
              flag: false,
              position: {
                left: 0,
                top: 0
              },
              start: {
                x: 0,
                y: 0
              },
              done: {}
            }
            // 绑定事件
            bar.onmousedown = function (event) {
              if (event.stopPropagation) {
                event.stopPropagation()
              }
              if (event.preventDefault) {
                event.preventDefault()
              }
              dragInfo.flag = true
              // 添加class
              target.classList.add(config.drag.class.start, config.drag.class.main)
              dragInfo.start = {
                x: event.clientX,
                y: event.clientY
              }
              dragInfo.position = {
                left: parseFloat(target.offsetLeft),
                top: parseFloat(target.offsetTop)
              }
              if (config.drag.callback && typeof config.drag.callback.start === 'function') {
                config.drag.callback.start(dragInfo.position)
              }
              // 绑定mousemove事件
              document.onmousemove = function (event) {
                if (event.stopPropagation) {
                  event.stopPropagation()
                }
                if (event.preventDefault) {
                  event.preventDefault()
                }
                if (dragInfo.flag) {
                  // 鼠标位置
                  let mousePosition = {
                    x: event.clientX,
                    y: event.clientY
                  }
                  // 检查范围
                  let range
                  let isOutRange = false
                  if (config.drag.range) {
                    range = config.drag.range
                    if (typeof config.drag.range === 'function') {
                      range = config.drag.range()
                      if (mousePosition.x < range.minX || mousePosition.x > range.maxX || mousePosition.y < range.minY || mousePosition.y > range.maxY) {
                        console.log('XDrag Warning:: drag out range!')
                        isOutRange = true
                      }
                    }
                  }
                  if (target.classList.contains(config.drag.class.start)) {
                    target.classList.remove(config.drag.class.start)
                  }
                  if (!target.classList.contains(config.drag.class.move)) {
                    target.classList.add(config.drag.class.move)
                  }
                  if (!isOutRange) {
                    let dis = {
                      x: mousePosition.x - dragInfo.start.x,
                      y: mousePosition.y - dragInfo.start.y
                    }
                    dragInfo.done = {
                      left: dragInfo.position.left + dis.x + 'px',
                      top: dragInfo.position.top + dis.y + 'px',
                      margin: 0
                    }
                    Object.keys(dragInfo.done).map(function (key) {
                      target.style[key] = dragInfo.done[key]
                    })
                  }
                  if (config.drag.callback && typeof config.drag.callback.move === 'function') {
                    config.drag.callback.move(dragInfo.done, mousePosition, range)
                  }
                }
              }
              // 绑定mouseup事件
              document.onmouseup = function (event) {
                if (event.stopPropagation) {
                  event.stopPropagation()
                }
                if (event.preventDefault) {
                  event.preventDefault()
                }
                dragInfo.flag = false
                Object.values(config.drag.class).map(function (className) {
                  target.classList.remove(className)
                })
                if (config.drag.callback && typeof config.drag.callback.done === 'function') {
                  config.drag.callback.done(dragInfo.done)
                }
                bar.onmouseup = null
                document.onmousemove = null
              }
            }
          }
          if (typeof config.drag.handler === 'string') {
            config.drag.handler = [config.drag.handler]
          }
          // 处理 bar
          for (let item of config.drag.handler) {
            let bar = item ? target.querySelector(item) : el
            handler(target, bar)
          }
        } else {
          console.log('XDrag Info:: drag not enabled!')
        }
        // 处理缩放
        if (config.resize && config.resize.enable) {
          // 处理 target
          let target = el
          if (typeof config.resize.handler === 'string') {
            console.log('XDrag Warning:: resize handler config error!')
            return
          }
          // 处理函数
          let handler = function (target, bar, direction) {
            let resizeInfo = {
              flag: false,
              position: {
                left: 0,
                top: 0
              },
              start: {
                x: 0,
                y: 0
              },
              direction: direction,
              done: {}
            }
            // 绑定事件
            bar.onmousedown = function (event) {
              if (event.stopPropagation) {
                event.stopPropagation()
              }
              if (event.preventDefault) {
                event.preventDefault()
              }
              resizeInfo.flag = true
              // 添加class
              target.classList.add(config.resize.class.start, config.resize.class.main)
              resizeInfo.start = {
                x: event.clientX,
                y: event.clientY
              }
              resizeInfo.position = {
                left: parseFloat(target.offsetLeft),
                top: parseFloat(target.offsetTop),
                width: parseFloat(getStyle(target, 'width')),
                height: parseFloat(getStyle(target, 'height'))
              }
              if (config.resize.callback && typeof config.resize.callback.start === 'function') {
                config.resize.callback.start(resizeInfo.position)
              }
              // 绑定mousemove事件
              document.onmousemove = function (event) {
                if (event.stopPropagation) {
                  event.stopPropagation()
                }
                if (event.preventDefault) {
                  event.preventDefault()
                }
                if (resizeInfo.flag) {
                  if (target.classList.contains(config.resize.class.start)) {
                    target.classList.remove(config.resize.class.start)
                  }
                  if (!target.classList.contains(config.resize.class.move)) {
                    target.classList.add(config.resize.class.move)
                  }
                  let dis = {
                    x: event.clientX - resizeInfo.start.x,
                    y: event.clientY - resizeInfo.start.y
                  }
                  let style
                  switch (resizeInfo.direction) {
                    case 'top-left':
                      style = {
                        width: resizeInfo.position.width - dis.x + 'px',
                        height: resizeInfo.position.height - dis.y + 'px',
                        left: resizeInfo.position.left + dis.x + 'px',
                        top: resizeInfo.position.top + dis.y + 'px'
                      }
                      break
                    case 'top-right':
                      style = {
                        width: resizeInfo.position.width + dis.x + 'px',
                        height: resizeInfo.position.height - dis.y + 'px',
                        top: resizeInfo.position.top + dis.y + 'px'
                      }
                      break
                    case 'bottom-left':
                      style = {
                        width: resizeInfo.position.width - dis.x + 'px',
                        height: resizeInfo.position.height + dis.y + 'px',
                        left: resizeInfo.position.left + dis.x + 'px'
                      }
                      break
                    case 'bottom-right':
                      style = {
                        width: resizeInfo.position.width + dis.x + 'px',
                        height: resizeInfo.position.height + dis.y + 'px'
                      }
                      break
                    case 'top-border':
                      style = {
                        height: resizeInfo.position.height - dis.y + 'px',
                        top: resizeInfo.position.top + dis.y + 'px'
                      }
                      break
                    case 'right-border':
                      style = {
                        width: resizeInfo.position.width + dis.x + 'px'
                      }
                      break
                    case 'bottom-border':
                      style = {
                        height: resizeInfo.position.height + dis.y + 'px'
                      }
                      break
                    case 'left-border':
                      style = {
                        width: resizeInfo.position.width - dis.x + 'px',
                        left: resizeInfo.position.left + dis.x + 'px'
                      }
                      break
                  }
                  resizeInfo.done = {
                    ...style
                  }
                  Object.keys(resizeInfo.done).map(function (key) {
                    target.style[key] = resizeInfo.done[key]
                  })
                  if (config.resize.callback && typeof config.resize.callback.move === 'function') {
                    config.resize.callback.move(resizeInfo.done)
                  }
                }
              }
              // 绑定mouseup事件
              document.onmouseup = function (event) {
                if (event.stopPropagation) {
                  event.stopPropagation()
                }
                if (event.preventDefault) {
                  event.preventDefault()
                }
                resizeInfo.flag = false
                Object.values(config.resize.class).map(function (className) {
                  target.classList.remove(className)
                })
                if (config.resize.callback && typeof config.resize.callback.done === 'function') {
                  config.resize.callback.done(resizeInfo.done)
                }
                bar.onmouseup = null
                document.onmousemove = null
              }
            }
          }
          // 处理 bar
          for (let direction of Object.keys(config.resize.handler)) {
            let item = config.resize.handler[direction]
            let bar = item ? target.querySelector(item) : el
            handler(target, bar, direction)
          }
        } else {
          console.log('XDrag Info:: resize not enabled!')
        }
      }
    }
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(XDrag)
}

export default XDrag
