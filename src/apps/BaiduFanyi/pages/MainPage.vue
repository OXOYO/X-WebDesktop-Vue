/**
* Created by OXOYO on 2018/8/20.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    overflow: auto;
    user-select: text;

    .block-header {
      padding: 20px 10px;

      .language-select {
        display: inline-block;

        .from-to-exchange {
          display: inline-block;
          padding: 0 10px;
          vertical-align: middle;

          img {
            width: 20px;
            height: 20px;
          }
        }
      }
      .action-btn {
        display: inline-block;
      }
    }
    .block-body {
      padding: 0 10px;

      .block-input {
        padding: 10px 0;
        min-height: 80px;
      }
      .block-output {
        padding: 10px;
        min-height: 80px;
        background: #f5f5f5;

        .translate-result {
          padding: 5px;
        }
      }
    }
  }
</style>

<template>
  <div class="main-page">
    <div class="block-header">
      <div class="language-select">
        <Select v-model="formData.from" style="width:200px">
          <OptionGroup
            v-for="(item, index) in languageGroupList"
            :label="item.groupLabel"
            :key="index"
          >
            <Option
              v-for="childItem in item.list"
              :value="childItem.val"
              :key="childItem.val"
            >
              {{ childItem.text }}
            </Option>
          </OptionGroup>
        </Select>
        <div class="from-to-exchange">
          <img src="../md-swap.svg" alt="">
        </div>
        <Select v-model="formData.to" style="width:200px">
          <OptionGroup
            v-for="(item, index) in languageGroupList"
            :label="item.groupLabel"
            :key="index"
          >
            <Option
              v-for="childItem in item.list"
              :value="childItem.val"
              :key="childItem.val"
            >
              {{ childItem.text }}
            </Option>
          </OptionGroup>
        </Select>
      </div>
      <div class="action-btn">
        <Button class="button" type="primary" :disabled="!formData.query" v-show="!isLoading" @click="handleTranslate">翻译</Button>
      </div>
    </div>
    <div class="block-body">
      <div class="block-input">
        <Input v-model="formData.query" type="textarea" autofocus :autosize="{minRows: 3}" placeholder="输入文字" />
      </div>
      <div class="block-output">
        <div
          class="translate-result"
          v-for="(item, index) in translateResult"
          :key="index"
        >
          {{ item.dst }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MD5 from 'md5'

  export default {
    name: 'MainPage',
    data () {
      return {
        isLoading: false,
        languageGroupList: [
          {
            groupLabel: '自动检测',
            list: [
              {
                val: 'auto',
                text: '自动检测'
              }
            ]
          },
          {
            groupLabel: '常用语种',
            list: [
              {
                val: 'zh',
                text: '中文'
              },
              {
                val: 'en',
                text: '英语'
              }
            ]
          },
          {
            groupLabel: 'ABC',
            list: [
              {
                val: 'ara',
                text: '阿拉伯语'
              },
              {
                val: 'est',
                text: '爱沙尼亚语'
              },
              {
                val: 'bul',
                text: '保加利亚语'
              },
              {
                val: 'pl',
                text: '波兰语'
              }
            ]
          },
          {
            groupLabel: 'DEFG',
            list: [
              {
                val: 'dan',
                text: '丹麦语'
              },
              {
                val: 'de',
                text: '德语'
              },
              {
                val: 'ru',
                text: '俄语'
              },
              {
                val: 'fra',
                text: '法语'
              },
              {
                val: 'fin',
                text: '芬兰语'
              }
            ]
          },
          {
            groupLabel: 'HIJKLMN',
            list: [
              {
                val: 'kor',
                text: '韩语'
              },
              {
                val: 'nl',
                text: '荷兰语'
              },
              {
                val: 'cs',
                text: '捷克语'
              },
              {
                val: 'rom',
                text: '罗马尼亚语'
              }
            ]
          },
          {
            groupLabel: 'OPQRST',
            list: [
              {
                val: 'pt',
                text: '葡萄牙语'
              },
              {
                val: 'jp',
                text: '日语'
              },
              {
                val: 'swe',
                text: '瑞典语'
              },
              {
                val: 'slo',
                text: '斯洛文尼亚语'
              },
              {
                val: 'th',
                text: '泰语'
              }
            ]
          },
          {
            groupLabel: 'UVWX',
            list: [
              {
                val: 'wyw',
                text: '文言文'
              },
              {
                val: 'spa',
                text: '西班牙语'
              },
              {
                val: 'el',
                text: '希腊语'
              },
              {
                val: 'hu',
                text: '匈牙利语'
              }
            ]
          },
          {
            groupLabel: 'YZ',
            list: [
              {
                val: 'zh',
                text: '中文'
              },
              {
                val: 'en',
                text: '英语'
              },
              {
                val: 'it',
                text: '意大利语'
              },
              {
                val: 'vie',
                text: '越南语'
              },
              {
                val: 'yue',
                text: '粤语'
              },
              {
                val: 'cht',
                text: '中文繁体'
              }
            ]
          }
        ],
        formData: {
          from: 'auto',
          to: 'en',
          query: ''
        },
        appid: '20180820000196336',
        key: 'WjsBnkboTn9mCaimqXjW',
        baseApi: '//api.fanyi.baidu.com/api/trans/vip/translate',
        translateResult: []
      }
    },
    methods: {
      handleTranslate: async function () {
        let _t = this
        if (!_t.formData.query) {
          return
        }
        let salt = (new Date()).getTime()
        let str = _t.appid + _t.formData.query + salt + _t.key
        let sign = MD5(str)
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/BaiduFanyi/translate', {
          from: _t.formData.from,
          to: _t.formData.to,
          q: _t.formData.query,
          appid: _t.appid,
          salt: salt,
          sign: sign
        })
        if (!res) {
          _t.$Message.error('翻译失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        _t.translateResult = res.data.trans_result || []
      }
    }
  }
</script>
