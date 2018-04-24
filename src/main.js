/**
 * Created by OXOYO on 2017/12/24.
 *
 */

import Vue from 'vue'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import createPersistedState from 'vuex-persistedstate'
import VueRouter from 'vue-router'
import axios from 'axios'
// 导入UI库
import iView from 'iview'
import 'iview/dist/styles/iview.css'
// 导入 动画库
import 'animate.css/animate.min.css'
// 导入 cookie插件
import * as Cookies from 'js-cookie'
// 导入 工具类
import utils from './global/utils'
// 导入 配置信息
import * as Config from './config'
// 导入 App组件
import App from './App'
// 导入 系统路由
import routers from './routers'
// 导入 系统 store 和 应用 store
import platformStore from './store/platform/index'
import appsStore from './store/apps/index'

// 注册全局组件
import NoData from './global/components/NoData.vue'
import Switch from './global/components/Switch.vue'
Vue.component('NoData', NoData)
Vue.component('USwitch', Switch)

// 导入 全局插件
// import plugin from './global/plugin'

// Vue 全局配置
let isDev = process && process.env.NODE_ENV !== 'production'
Vue.config.debug = isDev
Vue.config.devtools = isDev
Vue.config.productionTip = isDev

// 注册插件
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(iView)
import XDrag from './global/directives/XDrag'
Vue.use(XDrag)

// 注册全局 Cookies
Vue.prototype.$Cookies = Cookies
// 注册全局 utils
Vue.prototype.$utils = utils
// 注册全局 config
Vue.prototype.$Config = Config
// 注册全局 plugin
// Vue.prototype.$plugin = plugin

// 注册组件模板内 filters
for (let key in utils.filters) {
  Vue.filter(key, utils.filters[key])
}

// 配置 iView $Message
Vue.prototype.$Message.config({
  duration: 3
})

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: process && process.env.NODE_ENV !== 'production' ? Config.Serv.development : Config.Serv.production,
  withCredentials: true
})
// 设置 axiosInstance 拦截器
axiosInstance.interceptors.request.use((config) => {
  // loading 进度条启动
  Vue.prototype.$Loading.start()
  let key = Config.Cookie.getItem('token')
  let val = Cookies.get(key) || ''
  // 设置请求头
  config.headers.common[key] = val
  return config
}, function (error) {
  return Promise.reject(error)
})
axiosInstance.interceptors.response.use(function (response) {
  // loading 进度条关闭
  Vue.prototype.$Loading.finish()
  // 返回数据
  let resData = response && response.data ? response.data : response
  if (resData) {
    // 弹窗提示
    if (resData.status !== 200) {
      Vue.prototype.$Message.error(response.msg || resData.msg || '请求异常，请检查上送、返回。')
      if (resData.status === 9999) {
        // TODO 清空Session Storeage
        sessionStorage.clear()
        Object.keys(Cookies.get()).forEach(function (cookie) {
          Cookies.remove(cookie)
        })
        // TODO 跳转登录页
        setTimeout(function () {
          Vue.prototype.$nextTick(function () {
            routerInstance.push({name: 'platform.signin'})
          })
        }, 3000)
      }
      return Promise.reject(new Error(response.msg || resData.msg || '请求异常，请检查上送、返回。')).catch(function (result) {
        console.log(result)
      })
    }
  } else {
    Vue.prototype.$Message.error('请求失败！')
    return Promise.reject(new Error('请求失败！')).catch(function (result) {
      console.log(result)
    })
  }
  return resData
}, function (error) {
  return Promise.reject(error)
})

// 注册 $http
Vue.prototype.$http = axiosInstance

// 创建 router 实例
const routerInstance = new VueRouter({
  // 开启 HTML5 history 模式
  mode: 'history',
  base: '/X-WebDesktop-Vue/',
  routes: routers,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      const position = {}
      if (to.hash) {
        position.selector = to.hash
      }
      if (to.matched.some(m => m.meta.scrollToTop)) {
        position.x = 0
        position.y = 0
      }
      return position
    }
  }
})
// 注册全局前置守卫
routerInstance.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // 如果没有匹配项
  if (!to.matched.length) {
    // 判断路由类别
    if (to.path.includes('/admin/')) {
      next({ name: 'platform.admin.Error404ForAdmin' })
    } else {
      next({ name: 'platform.Error404' })
    }
  } else {
    next()
  }
})
// 注册全局后置钩子
routerInstance.afterEach((to, from) => {
  iView.LoadingBar.finish()
})

// 创建 store 实例
const storeInstance = new Vuex.Store({
  modules: {
    [platformStore.moduleName]: platformStore.store,
    [appsStore.moduleName]: appsStore.store
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})

// router & store 同步
sync(storeInstance, routerInstance, { moduleName: 'x-router' })

// 启动应用
new Vue({
  store: storeInstance,
  router: routerInstance,
  render: h => h(App)
}).$mount('#app')
