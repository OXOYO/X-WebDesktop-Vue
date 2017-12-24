/**
 * Created by OXOYO on 2017/12/6.
 */

import platformStore from '../../store/platform'
import appsStore from '../../store/apps'

export default {
  getType: function (path, key) {
    let flag = path.indexOf('/') === 0
    if (!key) {
      return flag ? path.slice(1, path.length) : path
    }
    let moduleName = ''
    switch (key) {
      case 'Platform':
        moduleName = platformStore.moduleName
        break
      case 'Apps':
        moduleName = appsStore.moduleName
    }
    if (moduleName) {
      // 判断路径开头是否包含 /
      return flag ? moduleName + path : moduleName + '/' + path
    }
    return flag ? path.slice(1, path.length) : path
  },
  getModuleName: function (key) {
    let moduleName = ''
    switch (key) {
      case 'Platform':
        moduleName = platformStore.moduleName
        break
      case 'Apps':
        moduleName = appsStore.moduleName
    }
    return moduleName
  }
}
