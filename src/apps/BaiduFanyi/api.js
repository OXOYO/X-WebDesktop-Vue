/**
 * Created by OXOYO on 2017/12/24.
 *
 * 接口
 */

import Vue from 'vue'

export default {
  doTranslate: async (data) => {
    let res = await Vue.prototype.$http.get('//api.fanyi.baidu.com/api/trans/vip/translate', {
      params: data
    })
    return res
  }
}
