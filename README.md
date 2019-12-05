# xos

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## 目录结构

```
|_ src
    |_ apps                             应用目录
        |_ DemoApp                      示例应用
            |_ install                  安装入口
            |_ uninstall                卸载入口
            |_ store                    状态管理
            |_ api                      接口
            |_ config                   配置
            |_ contextMenu              右键菜单
            |_ openApi                  对外接口
            |_ pages                    页面
            |_ Index.vue                应用入口
    |_ platform                         平台目录
        |_ ui                           UI
            |_ win7                     Win7 风格
                |_ features             功能
                    |_ Desktop          桌面
                    |_ Window           视窗
                    |_ TaskBar          任务栏
                    |_ ContextMenu      右键菜单
                    |_ SplitScreen      分屏
                    |_ Wallpaper        壁纸
                    |_ Setting          设置
                |_ config               风格配置
                |_ Index.vue            风格入口
            |_ win10                    Win10 风格
            |_ Mac                      Mac 风格
            ...
        |_ Index.vue                    平台入口
    |_ store                            状态管理
        |_ apps                         应用状态
        |_ platform                     平台状态
        |_ index.js                     状态入口
    |_ global                           全局
        |_ components                   组件
        |_ directives                   指令
        |_ lib                          库
        |_ plugin                       插件
        |_ utils                        工具
    |_ router                           平台路由
    |_ config                           平台配置
    |_ main.js                          平台入口
    |_ App.vue                          根组件
```
