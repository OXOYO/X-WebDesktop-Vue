/**
 * Created by OXOYO on 2018/1/24.
 *
 * 运行耗时统计
 */

export default {
  map: {},
  condition: {
    small: 10,
    middle: 50,
    large: 100
  },
  style: {
    small: 'color: #19be6b',
    middle: 'color: #ffad33',
    large: 'color: #f16543'
  },
  start: function (key) {
    let _t = this
    if (!_t.map[key]) {
      _t.map[key] = {
        start: new Date(),
        end: new Date(),
        sum: 0
      }
    } else {
      console.warn('TIME CONSUMING::', 'Repeated key:', key)
    }
  },
  end: function (key) {
    let _t = this
    if (!_t.map[key]) {
      console.warn('TIME CONSUMING::', 'Not existed key:', key)
      return
    }
    _t.map[key]['end'] = new Date()
    _t.map[key]['sum'] = _t.map[key]['end'] - _t.map[key]['start']
    let tmpArr = Object.keys(_t.condition)
    let tmpKey = tmpArr.find(condition => _t.map[key]['sum'] < _t.condition[condition])
    if (!tmpKey) {
      tmpKey = _t.condition[tmpArr[tmpArr.length - 1]]
    }
    let msg = [
      '%cTIME CONSUMING::',
      _t.map[key]['sum'],
      'key:',
      key,
      'condition:',
      _t.condition[tmpKey]
    ].join(' ')
    let style = _t.style[tmpKey]
    console.log(msg, style)
  }
}

