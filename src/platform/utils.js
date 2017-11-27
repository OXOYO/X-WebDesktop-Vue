/**
 * Created by OXOYO on 2017/6/26.
 *
 * 工具类
 */

import Vue from 'vue'
import { servConfig, cookieConfig } from './config.js'
import * as Cookies from 'js-cookie'

export const Serv = {
  getUrl: function (key) {
    let hostname = window && window.location && window.location.hostname || null
    let apiPath = ''
    let fullPath = ''
    if (hostname && servConfig.acceptHost.indexOf(hostname) > -1) {
      if (key && servConfig[key] && typeof servConfig[key] === 'string') {
        apiPath = servConfig[key]
      } else {
        apiPath = servConfig.development
      }
      fullPath = apiPath.includes('http') ? apiPath : 'http://' + hostname + apiPath
    } else {
      if (key === 'task') {
        apiPath = servConfig.task
      } else {
        apiPath = servConfig.production
      }
      fullPath = apiPath
    }

    return fullPath
  },
  // 处理Url
  handleUrl: function (path, type) {
    let base = Serv.getUrl(type) || ''

    if (base && path) {
      // 处理路径是否包含 '/'
      if (base.lastIndexOf('/') === base.length - 1 && path.indexOf('/') === 0) {
        return base.slice(0, base.length - 1) + path
      } else if (base.lastIndexOf('/') === base.length - 1 || path.indexOf('/') === 0) {
        return base + path
      } else {
        return base + '/' + path
      }
    } else {
      return ''
    }
  },
  // 处理参数
  handleParams: function (data) {
    if (data && data.hasOwnProperty('noToken') && !data.noToken) {
      data['token'] = Cookies.get(cookieConfig.keys.token) || ''
    }
    if (data && data.hasOwnProperty('noToken')) {
      delete data['noToken']
    }
    return data
  },
  // 处理返回数据
  handleRes: function (_t, res, showModal) {
    // 返回数据
    let resData = res && res.data ? res.data : ''
    if (resData) {
      // 弹窗提示
      if (res.status !== 200 || resData.status !== 200) {
        if (showModal) {
          Vue.prototype.$Message.error(res.msg || resData.msg || '请求异常，请检查上送、返回。')
        }
        if (resData.status === 9999) {
          // TODO 清空Session Storeage
          // sessionStorage.clear()
          Object.keys(Cookies.get()).forEach(function (cookie) {
            Cookies.remove(cookie)
          })
          // TODO 跳转登录页
          setTimeout(function () {
            _t.$nextTick(function () {
              _t.$router.push({name: 'platform.signin'})
            })
          }, 3000)
        }
        return Promise
          .reject(res.msg || resData.msg || '请求异常，请检查上送、返回。')
          .catch(function (result) {
            console.log(result)
          })
      }
    } else {
      Vue.prototype.$Message.error('请求失败！')
      return Promise
        .reject('请求失败！')
        .catch(function (result) {
          console.log(result)
        })
    }
    return resData
  },
  // 处理数据
  handleData: function (data, showModal) {
    let ret = data

    if (data) {
      // 弹窗提示
      if (data.status !== 200 && showModal) {
        Vue.prototype.$Message.error(data.msg || '返回数据异常，请检查上送、返回。')
      }
    } else {
      Vue.prototype.$Message.error('请求失败！')
    }

    return ret
  }
}
