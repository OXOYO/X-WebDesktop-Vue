/**
 * Created by OXOYO on 2018/4/23.
 *
 * 窗口插件 【废弃】
 */

import Vue from 'vue'
import Window from '../../../platform/apps/Window/Index.vue'

Window.open = function (ctx, options) {
  let _t = ctx
  let Constructor = Vue.extend(Window)
  console.log('Window.open', options)
  let component = new Constructor({
    store: _t.$store,
    propsData: {
      info: options
    }
  })
  component.$mount()
  document.querySelector('.app-desktop-box').appendChild(component.$el)
}

export default Window
