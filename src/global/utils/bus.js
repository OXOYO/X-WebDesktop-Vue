/**
 * Created by OXOYO on 2017/12/5.
 */

import Vue from 'vue'

const bus = new Vue()

// 清除监听事件
bus.$clear = function (types = []) {
  let _t = this
  if (types) {
    if (typeof types === 'string') {
      types = [types]
    }
    if (types instanceof Array) {
      for (let type of types) {
        _t.$off(type)
      }
    }
  }
}
// 注册监听事件
bus.$register = function (type, callback, _t, field) {
  if (_t) {
    let types = field || 'types'
    if (!_t[types]) {
      _t[types] = {}
    }
    _t[types][type] = true
  }
  bus.$on(type, callback)
}

export default bus
