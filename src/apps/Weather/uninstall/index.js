/**
 * Created by OXOYO on 2018/4/23.
 *
 * 卸载执行程序入口文件
 */

export default {
  // 初始化程序
  init: function (ctx, appData) {
    let _t = ctx
    // 打开安装界面
    // 广播事件 触发window事件 open
    _t.$utils.bus.$emit('platform/application/install', {
      action: 'openByUninstall',
      data: {
        appInfo: {
          // 解构应用基础配置
          ...appData.config,
          // 解构应用安装配置
          ...appData.uninstall,
          id: appData.id,
          // 赋值当前操作为 uninstall
          action: 'uninstall'
        }
      }
    })
  }
}
