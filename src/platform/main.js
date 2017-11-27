// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
// import createPersistedState from 'vuex-persistedstate'
import VueRouter from 'vue-router'
import axios from 'axios'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'animate.css/animate.min.css'
import XParticles from 'x-particles'

import * as Cookies from 'js-cookie'

import * as utils from './utils'
import { bus } from './bus'
import { cookieConfig } from './config'

import App from './App'
// FIXME 需要考虑主题
import routers from './routers.js'
// FIXME 需要考虑动态加载各个应用的store
import platformStore from './platformStore/index'
import appsStore from './appsStore/index'
// 导入过滤器
import filters from './filters'

// 注册全局组件
import TagList from '../global/components/TagList.vue'
import Switch from '../global/components/Switch.vue'
import NoData from '../global/components/NoData.vue'
import RainDay from '../global/components/RainDay.vue'
import Wallpaper from './components/Wallpaper.vue'
Vue.component('TagList', TagList)
Vue.component('USwitch', Switch)
Vue.component('NoData', NoData)
Vue.component('RainDay', RainDay)
Vue.component('Wallpaper', Wallpaper)

Vue.config.productionTip = false

// 注册插件
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(iView)
Vue.use(XParticles)

// 注册全局utils
Vue.prototype.$utils = utils

// 注册全局bus
Vue.prototype.$bus = bus

// 注册全局过滤器
// 组件methods内使用
Vue.prototype.$filters = filters
// 组件模板内使用
for (let key in filters) {
  Vue.filter(key, filters[key])
}

// 配置$Message
Vue.prototype.$Message.config({
  duration: 3
})

// 创建 axios 实例
const httpInstance = axios.create({
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  withCredentials: true
})

httpInstance.interceptors.request.use(function (config) {
  // let token = sessionStorage.getItem(cookieConfig.keys.token)
  let token = Cookies.get(cookieConfig.keys.token)
  // if (token) {
  // 设置请求头
  config.headers.common[cookieConfig.keys.token] = token || ''
  // }
  return config
})

// 注册$http
Vue.prototype.$http = httpInstance

// 创建router实例
const routerInstance = new VueRouter({
  // 开启 HTML5 history 模式
  mode: 'history',
  base: '/platform/',
  routes: routers
})

// 创建导航钩子
routerInstance.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

routerInstance.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
})

// 创建store实例
const storeInstance = new Vuex.Store({
  modules: {
    [platformStore.moduleName]: platformStore.store,
    [appsStore.moduleName]: appsStore.store
  },
  plugins: [
    // createPersistedState({
    //   storage: window.sessionStorage
    // })
  ]
})

// router & store 同步
sync(storeInstance, routerInstance, { moduleName: 'u-router' })

// 启动应用
new Vue({
  store: storeInstance,
  router: routerInstance,
  render: h => h(App)
}).$mount('#app')
