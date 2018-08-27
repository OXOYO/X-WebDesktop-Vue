/**
 * Created by OXOYO on 2017/12/24.
 *
 */

export default {
  // 默认配置 FIXME 可以考虑存入数据库，从而实现界面可视化动态配置
  // 组件对照表
  components: {
    // 后台容器
    Admin: {
      name: 'Admin',
      parent: './apps',
      path: './apps/Admin/',
      component: 'Index.vue',
      store: 'store/index.js',
      routers: 'routers.js'
    },
    // 右键菜单
    ContextMenu: {
      name: 'ContextMenu',
      parent: './apps',
      path: './apps/ContextMenu/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 桌面
    Desktop: {
      name: 'Desktop',
      parent: './apps',
      path: './apps/Desktop/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    /*
    // 桌面图标容器 FIXME 【废弃】
    DesktopIconBox: {
      name: 'DesktopIconBox',
      parent: './apps',
      path: './apps/DesktopIconBox/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    */
    // 桌面图标
    DesktopIcon: {
      name: 'DesktopIcon',
      parent: './apps',
      path: './apps/DesktopIcon/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 桌面控件
    DesktopWidget: {
      name: 'DesktopWidget',
      parent: './apps',
      path: './apps/DesktopWidget/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 前台容器
    Home: {
      name: 'Home',
      parent: './apps',
      path: './apps/Home/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 前台登录
    Login: {
      name: 'Login',
      parent: './apps',
      path: './apps/Login/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 开始菜单
    StartMenu: {
      name: 'StartMenu',
      parent: './apps',
      path: './apps/StartMenu/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 任务栏
    TaskBar: {
      name: 'TaskBar',
      parent: './apps',
      path: './apps/TaskBar/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 任务栏图标容器
    TaskBarIconBox: {
      name: 'TaskBarIconBox',
      parent: './apps',
      path: './apps/TaskBarIconBox/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 任务栏控件
    TaskBarWidget: {
      name: 'TaskBarWidget',
      parent: './apps',
      path: './apps/TaskBarWidget/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 窗口
    Window: {
      name: 'Window',
      parent: './apps',
      path: './apps/Window/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 壁纸
    Wallpaper: {
      name: 'Wallpaper',
      path: './apps/Wallpaper/',
      component: 'Index.vue',
      store: 'store/index.js'
    },
    // 分屏预览
    SplitScreen: {
      name: 'SplitScreen',
      path: './apps/SplitScreen/',
      component: 'Index.vue',
      store: 'store/index.js'
    }
  }
}
