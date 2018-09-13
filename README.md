# X-WebDesktop-Vue

Version: 2.0.0 【开发中...】

基于 Vue 的 WebDesktop 系统

# Version

| FrontEnd | API |
| :-------- | :-------- |
| [2.0.0](https://github.com/OXOYO/X-WebDesktop-Vue/tree/master) | [2.0.0](https://github.com/OXOYO/X-WebDesktop-Api-Koa/tree/master) |
| [1.0.1](https://github.com/OXOYO/X-WebDesktop-Vue/tree/1.0.1) | [1.0.1](https://github.com/OXOYO/X-WebDesktop-Api-Koa/tree/1.0.1) |
| [1.0.0](https://github.com/OXOYO/X-Desktop-Vue/tree/master) | - |

## Documentation

[中文文档 (2.0.0)](./document/README.md)

## Start

```bash
  git clone
  npm i
  npm run dev
```

## Build

```bash
  npm run build
```

## Preview

  **Url**：[http://47.93.49.248/X-WebDesktop-Vue/](http://47.93.49.248/X-WebDesktop-Vue/)

  **Account**：`admin`

  **Password**：`123456`

## Screenshot

![](./document/screenshot/preview_pc_admin_0913.png "preview_pc_admin")


## 目录结构
```bash
  \_ build                      // webpack配置
  \_ config                     // webpack配置
  \_ dist                       // 打包输出目录
  \_ docs                       // gh_pages文件目录
  \_ document                   // 文档
  \_ src                        // 源码
    \_ apps                     // 【自开发应用】
      \_ DemoApp                // 【DemoApp】应用
        \_ components           // 组件
        \_ containers           // 容器
        \_ pages                // 页面
        \_ install              // 自定义应用安装界面
          \_ Index.vue          // 自定义应用安装界面入口
        \_ uninstall            // 自定义应用卸载界面
          \_ Index.vue          // 自定义应用卸载界面入口
        \_ store                // Store
          \_ index.js           // Store入口
          \_ actions.js         // action定义
          \_ mutations.js       // mutation定义
          \_ state.js           // state定义
        \_ api.js               // 接口
        \_ config.js            // 配置文件
        \_ Index.vue            // 应用入口文件
        \_ openApi.js           // 对外接口【暂无意义】
        \_ contextMenu.js       // 右键菜单配置【暂无意义】
    \_ global                   // 【全局公用】目录
      \_ components             // 公用组件
      \_ directives             // 公用指令
      \_ plugin                 // 公用插件
      \_ utils                  // 公用工具
    \_ platform                 // 【平台】
      \_ apps                   // 平台默认应用
        \_ Admin                // 后台容器
          \_ components         // 组件
          \_ containers         // 容器
          \_ pages              // 页面
          \_ store              // Store
          \_ api.js             // 接口
          \_ config.js          // 配置文件
          \_ Index.vue          // 入口组件
          \_ openApi.js         // 对外接口
          \_ contextMenu.js     // 右键菜单配置
        \_ ContextMenu          // 右键菜单
        \_ Desktop              // 桌面
        \_ DesktopIcon          // 桌面图标
        \_ DekstopWidget        // 桌面控件
        \_ Home                 // 前台容器
        \_ Login                // 前台登录
        \_ StartMenu            // 开始菜单
        \_ TaskBar              // 任务栏
        \_ TaskBarIcon          // 任务栏图标
        \_ TaskBarWidget        // 任务栏控件
        \_ Window               // 应用窗口
      \_ store                  // 平台Store
      \_ config.js              // 平台配置
      \_ Index.vue              // 平台入口文件
    \_ App.vue                  // 根入口组件
    \_ config.js                // 根配置信息
    \_ main.js                  // 根入口js
    \_ routers.js               // 根路由js
  \_ static                     // 静态文件目录
  \_ index.html                 // 根入口html
```

## TODO
  1.架构调整，需重构，应用设计更合理。

  2.优化系统性能。

  3.编写开发指南。
