/**
 * Created by OXOYO on 2018/11/9.
 *
 * 禁用调试工具
 */

const closeWindow = (loop) => {
  clearInterval(loop)
  // 关闭当前窗口
  window.close()
  // 将当前窗口跳转置空白页
  window.location = 'about:blank'
  console.clear()
}

export default {
  init: function () {
    window.onkeydown = window.onkeyup = window.onkeypress = function (event) {
      // 判断是否按下F12，F12键码为123
      if (event.keyCode === 123) {
        event.preventDefault()
        window.event.returnValue = false
      }
    }
    // 为右键添加自定义事件
    window.oncontextmenu = function (event) {
      event.preventDefault()
      return false
    }
    // 打开控制台的宽或高阈值
    let threshold = 160
    let div = document.createElement('div')
    Object.defineProperty(div, 'id', {
      get: () => {
        closeWindow(loop)
      }
    })
    // 循环检测
    let loop = setInterval(function () {
      let startTime = performance.now()
      if (
        // 方式一：检测console相关对象
        (window.console && (console.firebug || console.table && /firebug/i.test(console.table()))) ||
        (typeof opera === 'object' && typeof opera.postError === 'function' && console.profile.length > 0) ||
        (typeof console.profiles === 'object' && console.profiles.length > 0) ||
        // 方式二：检测窗口宽高
        (window.outerWidth - window.innerWidth > threshold) ||
        (window.outerHeight - window.innerHeight > threshold)
      ) {
        closeWindow(loop)
      }
      // 方式三：复写div.id的getter方法，控制台打开时打印div会调用其div.id的get方法
      console.log(div)
      console.clear()
      // 方式四：复写toString方法，控制台打开时打印devtools会调用其toString方法
      let devtools = /./
      devtools.toString = function () {
        this.opened = true
        closeWindow(loop)
      }
      console.log('%c', devtools)
      console.clear()
      // 方式五：检测代码耗时，devtool下代码运行速度降低
      for (let i = 0; i < 1000; i++) {
        console.log(i)
        console.clear()
      }
      let diff = performance.now() - startTime
      if (diff > 200) {
        closeWindow(loop)
      }
    }, 1000)
  }
}
