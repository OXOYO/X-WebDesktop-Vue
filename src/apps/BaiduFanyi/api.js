/**
 * Created by OXOYO on 2017/12/24.
 *
 * 接口
 */

import Http from 'vue-resource/src/http'

export default {
  doTranslate: async (data) => {
    let res = await Http.jsonp('//api.fanyi.baidu.com/api/trans/vip/translate', {
      params: data
    })
    return res
  }
}
