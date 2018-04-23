/**
 * Created by OXOYO on 2018/4/23.
 *
 * 窗口插件
 */

import Vue from 'vue'
import Window from '../../../platform/apps/Window/Index.vue'

let component

export default {
  // 新开窗口
  open: function (options) {
    console.log('options', options)
    component = component || new Vue({
      render (h) {
        return h(Window, {
          props: {
            info: options
          }
        })
      }
    })
    let instance = component.$mount()
    console.log('vm instance', instance)
    document.body.appendChild(instance.$el)
  }
}
