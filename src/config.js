/**
 * Created by OXOYO on 2017/12/24.
 *
 */

// 服务配置
export const Serv = {
  development: '//localhost:3000/api',
  production: '//localhost:3000/api'
}

// cookie相关配置
export const Cookie = {
  prefix: 'x-',
  keys: {
    account: 'account',
    token: 'key',
    userType: 'user-type',
    userCode: 'user-code'
  },
  getItem: function (key) {
    return key ? this.prefix + this.keys[key] : ''
  }
}

// 系统配置
export const System = {
  version: '2.0.0',
  name: 'X-WebDesktop-Vue',
  title: 'X-WebDesktop-Vue',
  subtitle: 'X-WebDesktop-Vue',
  logo: '/static/logo.png',
  copyright: '© 2017'
}
