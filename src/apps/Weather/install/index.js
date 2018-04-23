/**
 * Created by OXOYO on 2018/4/23.
 *
 * 安装执行程序入口文件
 */

export default {
  // 初始化程序
  init: function (ctx) {
    let _t = ctx
    // 1.读取配置信息
    let options = {
      id: 100,
      name: 'Weather',
      title: '今日天气',
      description: '今日天气APP',
      type: 0,
      user_type: 0,
      publish: 1,
      category: '',
      config: {
        'app': {
          'id': '',
          'name': 'AccountManagement',
          'icon': './static/apps/AccountManagement/logo.png',
          'title': '账号管理',
          'x': 0,
          'y': 0,
          'index': ''
        },
        'desktopIcon': {'style': {'left': '', 'top': ''}},
        'window': {
          'size': 'custom',
          'status': 'close',
          'zIndex': 600,
          'type': 'modal',
          'enableResize': ['custom', 'small', 'min', 'max', 'middle', 'reset', 'close'],
          'style': {'width': '1000px', 'height': '800px', 'left': 'calc(50% - 500px)', 'top': 'calc(50% - 400px)'}
        },
        'taskBar': {'isPinned': true}
      },
      create_time: '2017-07-10 10:59:14',
      update_time: '2017-07-10 10:59:14'
    }
    // 2.打开安装界面
    console.log('ctx', _t.$plugin.Window)
    _t.$plugin.Window.open(options.config)
  }
}
