/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-start-menu {
    display: inline-block;
    width: 60px;
    height: 39px;
    margin: 0;
    position: relative;
    user-select:none;

    .start-menu-icon-main {
      width: 60px;
      height: 39px;
      line-height: 39px;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: all .2s ease-out;

      &:hover {
        &:after {
          content: ' ';
          position: absolute;
          z-index: -1;
          /*background: red;*/
          /*background: rgba(250, 253, 255, .5);*/
          background: rgba(255, 255, 255, 0.3);
          /*opacity: .5;*/
          filter: blur(10px);
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
        .app-icon-bg {
          .content {
            background: url("./images/StartMenu.png");
            filter: blur(10px);
          }
        }
      }

      .app-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -20px;
        margin-top: -20px;
        width: 40px;
        height: 40px;
        /*filter: drop-shadow(0 0 10px #ccc);*/
        /*background: hsla(0,0%,100%,.25) border-box;*/
        /*box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);*/
      }
      .app-icon-down {
        margin-left: -19px;
        margin-top: -19px;
      }
      .app-icon-bg {
        position: absolute;
        display: block;
        overflow: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        /*filter: blur(50px);*/
        /*background-position: center top;*/
        transition: all .2s ease-out;
        /*background-size: cover;*/
        /*background-attachment: fixed;*/

        .content {
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          filter: blur(50px);
          background-color: transparent;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
        }
      }
    }

    .start-menu-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -15px;
      margin-top: -15px;
      width: 30px;
      height: 30px;
    }
    .start-menu-box {
      position: absolute;
      z-index: 5000;
      left: 0;
      bottom: 40px;
      width: 410px;
      height: 600px;
      padding: 8px;
      border: 1px solid rgba(14, 46, 73, 0.3);
      box-shadow: 5px -5px 5px 0px rgba(0, 0, 0, 0.1);

      .start-menu-bg {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: inline-block;
        overflow: hidden;
      }

      .start-menu-body {
        position: absolute;
        top: 8px;
        right: 8px;
        bottom: 8px;
        left: 8px;
      }
      .list-block {
        width: 61%;
        max-width: 250px;
        height: 100%;
        background: rgba(255, 255, 255, .5);
        display: inline-block;
        float: left;
        overflow: auto;
        .list-item {
          position: relative;
          width: 100%;
          /*height: 35px;*/
          /*line-height: 35px;*/
          padding: 5px 5px 5px 10px;
          cursor: default;
          &:before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 4px;
            background: transparent;
            transition: all .2s;
          }
          &:hover {
            /*background: #f3f3f3;*/
            /*background: #cfe3fd;*/
            background: #fff;
            &:before {
              /*background: #2A5AAD;*/
              background: #57a3f3;
            }
          }
          .list-item-icon {
            display: inline-block;
            vertical-align: middle;
            width: 30px;
            height: 30px;
            img {
              width: 100%;
            }
          }
          .list-item-title {
            display: inline-block;
            vertical-align: middle;
            color: #000;
          }
        }
      }
      .info-block {
        position: relative;
        width: 34%;
        max-width: 140px;
        height: 100%;
        /*background: red;*/
        /*background: rgba(0, 0, 0, .1);*/
        display: inline-block;
        padding: 0 10px;
        color: #ffffff;
        float: right;
        .info-link {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 70px;
          left: 0;
          /*background: #2baee9;*/
          /*border: 1px solid red;*/
          text-align: center;
          padding: 20px 5px 0;
          .info-avatar {
            position: absolute;
            left: 50%;
            top: -28px;
            margin-left: -20px;
            z-index: 5010;
          }
          .info-action-group {
            margin: 5px 10px;
            padding-top: 10px;
            text-align: left;
            &+.info-action-group {
              border-top: 1px solid #999;
            }
            .info-action-item {
              display: inline-block;
              width: 100%;
              padding: 5px 0;
              cursor: default;
              &:hover {
                color: #57a3f3;
              }
            }
          }
        }
        .info-btn {
          position: absolute;
          right: 0;
          bottom: 40px;
          left: 0;
          height: 45px;
          line-height: 45px;
          /*background: brown;*/
          /*border: 1px solid red;*/
          text-align: center;
          padding: 0 5px;
          .info-btn-item {
            color: #ffffff;
          }
        }
        .info-author {
          position: absolute;
          right: 0;
          bottom: 20px;
          left: 0;
          padding: 0 5px;
          text-align: right;

          .info-author-link {
            display: inline-block;
            color: #ffffff;

            &:hover {
              color: #2d8cf0;
            }
          }
        }
        .info-version {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          padding: 0 5px;
          text-align: right;
        }
      }
    }
  }
</style>

<template>
  <div class="app-start-menu">
    <div
      class="start-menu-icon-main"
      @click.stop.prevent
      @mousedown.left.stop="handleMouseDown"
      @mouseup.left.stop="handleMouseUp"
    >
      <img class="app-icon" :class="{ 'app-icon-down': isMouseDown}" src="./images/StartMenu.png">
      <div class="app-icon-bg">
        <div class="content"></div>
      </div>
    </div>
    <div
      class="start-menu-box"
      :style="menuBoxStyle"
      v-show="isShow"
      @contextmenu.stop.prevent
    >
      <div
        class="start-menu-bg"
      >
        <WallpaperBackground></WallpaperBackground>
      </div>
      <div class="start-menu-body">
        <div class="list-block">
          <div
            class="list-item"
            v-for="item in appData.iconList"
            :key="item.id"
            @click.stop.prevent="openApp(item)"
          >
            <div class="list-item-icon">
              <img v-if="item.config.app.icon" :src="item.config.app.icon">
            </div>
            <div class="list-item-title">
              {{ item.config.app.title }}
            </div>
          </div>
        </div>
        <div class="info-block">
          <div class="info-link">
            <Avatar class="info-avatar" shape="square" icon="person" size="large" />
            <div class="info-action-group">
              <div class="info-action-item">
                <h2>{{ userInfo.name }}</h2>
              </div>
              <div class="info-action-item">
                个人中心
              </div>
              <div class="info-action-item">
                My Apps
              </div>
            </div>
            <div class="info-action-group">
              <div class="info-action-item">
                系统设置
              </div>
            </div>
          </div>
          <div class="info-btn">
            <Button class="info-btn-item" type="ghost" long @click="doLogout">退出</Button>
          </div>
          <div class="info-author" v-if="$Config.System.author">
            Author：
            <a class="info-author-link" v-if="$Config.System.repository.url" :href="$Config.System.repository.url" target="_blank">{{ $Config.System.author }}</a>
            <div class="info-author-link" v-else>{{ $Config.System.author }}</div>
          </div>
          <div class="info-version" v-if="$Config.System.version">
            Version：{{ $Config.System.version }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'StartMenu',
    data () {
      return {
        isShow: false,
        userInfo: {
          name: 'admin',
          text: 'admin'
        },
        isMouseDown: false,
        // 开始菜单窗口样式
        menuBoxStyle: {}
      }
    },
    computed: {
      ...mapState('Platform/Admin', {
        appData: state => state.appData
      })
    },
    methods: {
      // 鼠标按下
      handleMouseDown: function () {
        let _t = this
        _t.isMouseDown = true
      },
      // 鼠标抬起
      handleMouseUp: function () {
        let _t = this
        _t.isMouseDown = false
        _t.isShow = !_t.isShow
        // 广播事件
        _t.$utils.bus.$emit('platform/contextMenu/hide')
      },
      doLogout: function () {
        let _t = this
        // TODO 执行退出
        sessionStorage.clear()
        Object.keys(_t.$Cookies.get()).forEach(function (cookie) {
          _t.$Cookies.remove(cookie)
        })
        // 清空用户登录信息
        _t.$store.commit(_t.$utils.store.getType('userInfo/reset', 'Platform'))
        _t.$router.push({name: 'platform.index'})
      },
      openApp: function (info) {
        let _t = this
        // 应用数据
        let appInfo = {...info}
        // 广播事件 触发window事件 open
        _t.$utils.bus.$emit('platform/window/trigger', {
          // 通过开始菜单列表打开
          action: 'openByStartMenuList',
          data: {
            appInfo: appInfo
          }
        })
      },
      // 处理窗口大小
      handleMenuBoxStyle: function () {
        let _t = this
        let bodyHeight = document.body.offsetHeight
        let height = Math.ceil(bodyHeight * 0.8)
        height = height < 500 ? 500 : height > 600 ? 600 : height
        let width = Math.ceil(height * 0.7)
        _t.menuBoxStyle = {
          height: height + 'px',
          width: width + 'px'
        }
      }
    },
    created: function () {
      let _t = this
      // 监听事件
      _t.$utils.bus.$on('platform/startMenu/hide', function () {
        _t.isShow = false
      })
      // 处理窗口大小
      _t.handleMenuBoxStyle()
    },
    beforeDestroy: function () {
      let _t = this
      _t.$utils.bus.$off([
        'platform/startMenu/hide'
      ])
    }
  }
</script>
