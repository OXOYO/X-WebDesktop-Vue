/**
* Created by yangfan9244 on 2018/8/20.
*
*/

<style lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    overflow: auto;

    .block-header {

    }
    .block-body {
      height: calc(~"100% - 50px");
      border-bottom: 1px solid rgba(0, 0, 0, .1);
      padding: 10px;
      overflow: auto;

      .msg-item {
        display: inline-block;
        margin: 10px 0;
        width: 100%;

        &.msg-robot {
          .item-avatar {
            float: left;
            margin-right: 10px;
          }
          .item-content {
            float: left;
          }
        }
        &.msg-visitor {
          .item-avatar {
            float: right;
            margin-left: 10px;
          }
          .item-content {
            float: right;
          }
          .msg-status-fail {
            float: right;
          }
        }
        &.msg-system {

        }

        .item-avatar {
          width: 32px;
          height: 32px;
          display: inline-block;
        }

        .msg-status-fail {
          color: #ed3f14;
          margin: 12px;
        }

        .item-content {
          display: inline-block;
          max-width: calc(~"100% - 45px");
          padding: 10px;
          word-break: break-all;
          word-wrap: break-word;
          border-radius: 4px;
          background: #f5f7f9;

          &.msg-last {
            background: #2db7f5;
            color: #ffffff;

            a {
              color: #ffffff;
            }
          }

          &.msg-type-text {

          }

          img {
            max-width: 100%;
          }

          .news-item {
            display: inline-block;
            width: 100%;
            max-height: 60px;
            margin-bottom: 10px;
            overflow: hidden;

            &:hover {
              background: #ffffff;

              .title {
                color: #495060;
              }
            }

            .icon {
              width: 60px;
              height: 60px;
              float: left;
            }
            .title {
              width: calc(~"100% - 70px");
              max-height: 60px;
              overflow: hidden;
              text-overflow: ellipsis;
              float: right;
            }
          }
        }
      }
    }
    .block-footer {
      position: relative;
      height: 50px;
      padding: 10px;

      .msg-input {
        width: 200px;

        input {
          border: none;
          outline: none;

          &:focus {
            box-shadow: none;
          }
        }
      }

      .msg-send {
        width: 40px;
        float: right;
      }
    }
  }
</style>

<template>
  <div class="main-page">
    <div class="block-header"></div>
    <div class="block-body">
      <div
        v-for="(item, index) in msgList"
        :class="item.user ? 'msg-' + item.user : ''"
        class="msg-item"
      >
        <Avatar
          v-if="item.user === 'robot'"
          shape="square"
          class="item-avatar"
          :src="info.config.app.icon"
        ></Avatar>
        <div
          :class="[item.type ? 'msg-type-' + item.type : '', index === msgList.length - 1 ? 'msg-last' : '']"
          class="item-content"
        >
          <template v-if="item.type === 'text'">
            {{ item.msg }}
          </template>
          <template v-if="item.type === 'url'">
            <a :href="item.msg" target="_blank">{{ item.msg }}</a>
          </template>
          <template v-if="item.type === 'image'">
            <img :src="item.msg">
          </template>
          <template v-if="item.type === 'news'">
            <a
              class="news-item"
              v-for="(newsItem, newsIndex) in item.msg"
              :key="newsIndex"
              :href="newsItem.detailurl"
              target="_blank"
            >
              <img class="icon" :src="newsItem.icon">
              <div class="title">{{ newsItem.name }}</div>
            </a>
          </template>
        </div>
        <Icon v-if="item.status === 'fail'" class="msg-status-fail" type="information-circled"></Icon>
      </div>
    </div>
    <div class="block-footer">
      <Input class="msg-input" v-model="msg" placeholder="Enter something..." @on-enter="handleSendMsg"></Input>
      <Button class="msg-send" type="text" icon="android-send" @click="handleSendMsg"></Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MainPage',
    data () {
      return {
        userId: 'iChatVisitor' + (new Date()).getTime(),
        msg: '',
        msgList: [
          {
            // 用户类别 robot: 机器人  visitor: 访客  system: 系统
            user: 'robot',
            // 消息类型
            type: 'text',
            status: 'success',
            msg: '您好，小主人'
          }
          /*
          ,
          {
            user: 'visitor',
            type: 'text',
            status: 'fail',
            msg: '你好'
          }
          */
        ]
      }
    },
    props: {
      info: {
        type: Object
      }
    },
    methods: {
      handleSendMsg: async function () {
        let _t = this
        if (!_t.msg) {
          return
        }
        let msg = _t.msg
        // 清空输入框
        _t.msg = ''
        let payload = {
          reqType: 0,
          perception: {
            // 文本消息
            inputText: {
              text: msg
            },
            /*
            // 图片消息
            inputImage: {
              url: ''
            },
            // 音频消息
            inputMedia: {
              url: ''
            },
            */
            selfInfo: {
              location: {
                city: '北京',
                province: '北京',
                street: '信息路'
              }
            }
          },
          userInfo: {
            apiKey: '3ae9cf6b8f2b4c708bdfe7451bdf65ac',
            userId: _t.userId
          }
        }
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/iChat/sendMessage', payload)
        if (!res || res.status !== 200) {
          _t.msgList.push({
            user: 'visitor',
            type: 'text',
            status: 'fail',
            msg: msg
          })
        } else {
          _t.msgList.push({
            user: 'visitor',
            type: 'text',
            status: 'success',
            msg: msg
          })
          let resData = res.data.results || []
          resData.map(item => {
            _t.msgList.push({
              user: 'robot',
              type: item.resultType,
              status: 'success',
              msg: item.values[item.resultType]
            })
          })
        }
        // 滚动到最底部
        _t.$nextTick(function () {
          // 滚动到最底部
          let elBlockBody = _t.$el.querySelector('.block-body')
          elBlockBody.scrollTop = elBlockBody.scrollHeight
        })
      }
    }
  }
</script>
