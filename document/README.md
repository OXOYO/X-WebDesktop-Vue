# X-WebDesktop 中文文档

## 介绍

X-WebDesktop 是一个基于 [Vue](https://github.com/vuejs/vue) && [Koa](https://github.com/koajs/koa) 的仿 [Microsoft Windows](https://www.microsoft.com/zh-cn/windows) 风格的 PC 网站。

### 在线预览

**Url**：[https://oxoyo.github.io/X-WebDesktop-Vue/](https://oxoyo.github.io/X-WebDesktop-Vue/)

**Account**：`admin`

**Password**：`123456`
 
### 更新日志

最新稳定版本：2.0.0

| FrontEnd | API |
| :-------- | :-------- |
| [2.0.0](https://github.com/OXOYO/X-WebDesktop-Vue/tree/master) | [2.0.0](https://github.com/OXOYO/X-WebDesktop-Api-Koa/tree/master) |
| [1.0.1](https://github.com/OXOYO/X-WebDesktop-Vue/tree/1.0.1) | [1.0.1](https://github.com/OXOYO/X-WebDesktop-Api-Koa/tree/1.0.1) |
| [1.0.0](https://github.com/OXOYO/X-Desktop-Vue/tree/master) | - |

## 起步

在你开始阅读以下章节时，官方指南假设你已了解 `Vue` 和 `Koa` 相关生态的知识点，并有一定的实际项目经验。如果你还不是很了解请先阅读 [Vue](https://github.com/vuejs/vue) && [Koa](https://github.com/koajs/koa) 相关的文档。

### 本地运行

1.clone 前端工程
```
git clone https://github.com/OXOYO/X-WebDesktop-Vue.git
```
1.1.安装依赖
```
npm i
```
1.2.运行开发环境
```
npm run dev
> Starting dev server...
> Listening at http://localhost:8899
```
2.clone API工程
```
git clone https://github.com/OXOYO/X-WebDesktop-Api-Koa.git
```
2.1.安装依赖
```
npm i
```
2.2.导入数据库文件
```
Import the "X-WebDesktop-Api-Koa/src/sql/x-webdesktop-v2.sql" file into the database;
```
2.3.运行开发环境
```
npm run dev
> Starting dev server...
> x-webdesktop-api is listening to http://localhost:3000
```

### 前端架构

#### 技术栈

```
vue-cli       脚手架

Vue           核心框架
vue-router    路由
vuex          状态管理
iview         UI库
axios         Ajax库
animate.css   动画库

webpack       工程化
```

#### 项目结构

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

### API架构

#### 技术栈

```
Koa               核心框架
koa-router        路由中间件
koa-cors          跨域中间件
axios             Ajax库
jsonwebtoken      JsonWebToken
log4js            日志输出
mysql2            数据库
sequelize         数据库ORM

gulp              工程化
pm2               进程管理
```

#### 项目结构

```bash
  \_ assets                   // 静态文件目录
  \_ build                    // 打包脚本
  \_ dist                     // 打包输出目录
  \_ logs                     // 日志输出目录
  \_ src                      // 源码
    \_ apps                   // 【应用】对应接口目录
      \_ AccountManagement    // 【账号管理】应用
        \_ Ctrl.js            // 控制器
        \_ Model.js           // 模型
        \_ Routers.js         // 路由
      \_ ApplicationMarket    // 【应用市场】应用
        \_ Ctrl.js            // 控制器
        \_ Model.js           // 模型
        \_ Routers.js         // 路由
      \_ MyApplication        // 【我的应用】应用
        \_ Ctrl.js            // 控制器
        \_ Model.js           // 模型
        \_ Routers.js         // 路由
      \_ PersonalCenter       // 【个人中心】应用
        \_ Ctrl.js            // 控制器
        \_ Model.js           // 模型
        \_ Routers.js         // 路由
    \_ middleware             // 中间件
    \_ schema                 // 数据库模型
    \_ platform               // 【平台】基础接口目录
      \_ Ctrl.js              // 控制器
      \_ Model.js             // 模型
      \_ Routers.js           // 路由
    \_ sql                    // 备份SQL文件
    \_ utils                  // 全局工具
    \_ api.js                 // 封装提供给前端的API
    \_ auth.js                // 鉴权
    \_ config.js              // 全局配置
    \_ db.js                  // 数据库实例
    \_ routers.js             // 封装应用路由表
  \_ ecosystem.config.js      // PM2配置
  \_ gulpfile.js              // gulp任务脚本
```
