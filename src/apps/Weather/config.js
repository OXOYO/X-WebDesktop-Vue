/**
 * Created by OXOYO on 2017/12/24.
 *
 * 配置信息 基本与同 platform_apps 表字段相同
 */

export default {
  id: '',
  name: 'Weather',
  title: '今日天气',
  description: '今日天气APP',
  type: 0,
  user_type: 0,
  publish: 1,
  category: 'other',
  config: {
    app: {
      id: '',
      name: 'Weather',
      icon: './static/apps/Weather/logo.png',
      title: '今日天气',
      x: 0,
      y: 0,
      index: '',
      installed: false
    },
    desktopIcon: {
      style: {
        left: '',
        top: ''
      }
    },
    window: {
      size: 'custom',
      status: 'close',
      type: 'modal',
      enableResize: ['custom', 'small', 'min', 'max', 'middle', 'reset', 'close'],
      style: {
        width: '1000px',
        height: '800px',
        left: 'calc(50% - 500px)',
        top: 'calc(50% - 400px)'
      }
    },
    taskBar: {
      isPinned: true
    }
  },
  install: {
    window: {
      size: 'custom',
      status: 'close',
      type: 'modal',
      enableResize: ['custom', 'close'],
      style: {
        width: '400px',
        height: '300px',
        left: 'calc(50% - 200px)',
        top: 'calc(50% - 150px)'
      }
    },
    taskBar: {
      isPinned: false
    }
  },
  uninstall: {
    window: {
      size: 'custom',
      status: 'close',
      type: 'modal',
      enableResize: ['custom', 'close'],
      style: {
        width: '400px',
        height: '200px',
        left: 'calc(50% - 200px)',
        top: 'calc(50% - 150px)'
      }
    },
    taskBar: {
      isPinned: false
    }
  },
  create_time: '',
  update_time: ''
}
