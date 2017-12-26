/**
 * Created by OXOYO on 2017/12/24.
 *
 */

export default [
  // 平台首页
  {
    path: '/',
    name: 'platform.index',
    component: resolve => require(['./platform/Index'], resolve),
    meta: {
      title: '首页',
      requiresAuth: false
    },
    children: [
      {
        path: 'Error404',
        name: 'platform.Error404',
        component: resolve => require(['./global/components/Error404'], resolve),
        meta: {
          title: 'Error404',
          requiresAuth: false,
          scrollToTop: true
        }
      }
    ]
  }
]
