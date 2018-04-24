/**
 * Created by OXOYO on 2018/4/24.
 *
 * 应用卸载工具
 */

export default function (ctx, appData) {
  let _t = ctx
  let appInfo = Object.assign(
    {},
    // 解构应用基础配置
    appData.config,
    // 解构应用安装配置
    appData.install,
    {
      id: appData.id,
      // 赋值当前操作为 install
      action: 'uninstall'
    }
  )
  // 广播事件 打开卸载界面
  _t.$utils.bus.$emit('platform/application/uninstall', {
    action: 'openByUninstall',
    data: {
      appInfo: JSON.parse(JSON.stringify(appInfo))
    }
  })
}
