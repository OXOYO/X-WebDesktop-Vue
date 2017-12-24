/**
 * Created by OXOYO on 2017/12/24.
 *
 */

export default [
  // 平台首页
  {
    path: '/',
    name: 'platform.home',
    component: resolve => require(['./platform/Index'], resolve),
    meta: {
      title: '首页',
      requiresAuth: false
    }
    // ,
    // children: [
    //   // 登录
    //   {
    //     path: 'signin',
    //     name: 'platform.home.signin',
    //     component: resolve => require(['./pages/SignIn'], resolve),
    //     meta: {
    //       title: '登录',
    //       requiresAuth: false
    //     }
    //   }
    // ]
  }
]
