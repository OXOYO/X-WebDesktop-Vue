/**
 * Created by OXOYO on 2017/7/13.
 */

// 服务配置
export const servConfig = {
  acceptHost: [
    'localhost',
    '127.0.0.1'
  ],
  development: 'http://localhost:3000/api/',
  production: 'http://localhost:3000/api/'
}

// cookie相关配置
export const cookieConfig = {
  keys: {
    account: 'x-account',
    userName: 'x-userName',
    token: 'x-key',
    userType: 'x-type',
    userCode: 'x-code',
    secret: 'x-webdesktp'
  }
}

// 系统配置
export const systemConfig = {
  version: '1.0.1',
  create_time: '2017-07-11 09:14:00',
  update_time: '2017-11-27 15:16:02',
  name: '',
  title: 'X-WebDesktop-Vue',
  subtitle: 'X-WebDesktop-Vue'
}
