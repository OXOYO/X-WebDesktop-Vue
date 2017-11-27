/**
 * Created by OXOYO on 2017/7/3.
 *
 * 账号管理 路由
 */

export default [
  // 账号管理 首页
  {
    path: 'account-management',
    name: 'accountManagement.index',
    component: resolve => require(['./Index'], resolve),
    // 路由元信息
    meta: {
      title: '首页',
      requiresAuth: false
    }
  }
]
