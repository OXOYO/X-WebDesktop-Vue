/**
 * Created by OXOYO on 2018/4/24.
 *
 * 应用安装工具
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
      action: 'install'
    }
  )
  // 广播事件 打开安装界面
  _t.$utils.bus.$emit('platform/application/install', {
    action: 'openByInstall',
    data: {
      appInfo: JSON.parse(JSON.stringify(appInfo))
    }
  })
}
