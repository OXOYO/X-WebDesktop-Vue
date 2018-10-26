/**
 * Created by OXOYO on 2017/12/5.
 */

export default {
  // 日期格式化
  formatDate: (time, fmt = 'yyyy-MM-dd hh:mm') => {
    // console.log('time', time, typeof time)
    if (time instanceof Date) {
      time = new Date(time).getTime()
    }
    let timeStr = time + ''
    // 10位时间戳格式化
    if (timeStr.length < 13) {
      time = time * (Math.pow(10, 13 - timeStr.length))
    }
    time = parseInt(time)
    if (isNaN(time)) {
      return ''
    }
    let date = new Date(time)
    let padLeftZero = (str) => {
      return ('00' + str).substr(str.length)
    }
    let doFormatDate = (date, fmt) => {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let obj = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in obj) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = obj[k] + ''
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
        }
      }
      return fmt
    }

    return doFormatDate(date, fmt)
  },
  // 千分位格式化
  formatThousands: function (num) {
    num = (num || 0).toString()
    let result = ''
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result
      num = num.slice(0, num.length - 3)
    }
    if (num) {
      result = num + result
    }
    return result
  }
}
