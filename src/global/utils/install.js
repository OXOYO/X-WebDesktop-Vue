/**
 * Created by OXOYO on 2018/4/24.
 *
 * 应用安装工具
 */

export default function (ctx, appInfo) {
  let _t = ctx
  // 广播事件 打开安装界面
  _t.$utils.bus.$emit('platform/application/install', {
    action: 'openByInstall',
    data: {
      appInfo: JSON.parse(JSON.stringify(appInfo))
    }
  })
}
