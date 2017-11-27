/**
 * Created by OXOYO on 2017/6/26.
 *
 * 平台路由表
 */

export default [
  // 平台首页
  {
    path: '/',
    name: 'platform.index',
    component: resolve => require(['./pages/Index'], resolve),
    meta: {
      title: '首页',
      requiresAuth: false
    },
    children: [
      // 登录
      {
        path: 'signin',
        name: 'platform.signin',
        component: resolve => require(['./pages/SignIn'], resolve),
        meta: {
          title: '登录',
          requiresAuth: false
        }
      }
    ]
  }
]
