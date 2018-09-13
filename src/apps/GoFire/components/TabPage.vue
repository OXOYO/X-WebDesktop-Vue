/**
* Created by OXOYO on 2018/9/7.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .tab-page {
    border-bottom: 1px solid #b6b4b4;
    .tab-bar {
      position: relative;
      display: flex;
      width: 100%;
      background: transparent;
      overflow: hidden;

      .tab-bar-item {
        display: inline-block;
        flex: auto;
        max-width: 250px;
        height: 36px;
        background: #E8ECF1;
        color: #788288;
        padding: 8px 15px;
        margin-right: 1px;
        z-index: 1;

        &.active {
          background: #ffffff !important;
          color: #3C4043;
        }

        &.new-tab {
          display: inline-block;
          width: 30px;
          font-size: 32px;
          text-align: center;
          flex: none;
          padding: 0;
          margin-left: 5px;
          background: transparent;
          line-height: initial;
          color: #ffffff;

          &:hover {
            color: #eeeeee;
            background: transparent;
          }
        }

        &:hover {
          background: #eeeeee;
        }

        .title {
          display: inline-block;
          width: calc(~'100% - 20px');
          height: 20px;
          word-break: keep-all;
          overflow: hidden;
        }
        .close {
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 50%;
          float: right;
          text-align: center;

          &:hover {
            background: #3C4043;
            color: #ffffff;
          }
        }
      }
    }
    .tab-menu {
      display: inline-block;
      width: 100%;
      padding: 0 15px;
      margin: 5px 0;

      .tool-item {
        display: inline-block;
        width: 30px;
        font-size: 20px;
        text-align: center;
        vertical-align: middle;
        border-radius: 50%;

        &:hover {
          background: #eeeeee;
        }
      }
      .input {
        display: inline-block;
        vertical-align: middle;
        margin: 0 15px;
      }
    }
  }
</style>

<template>
  <div class="tab-page">
    <!-- tab列表 -->
    <div class="tab-bar">
      <WallpaperBackground style="z-index: auto;"></WallpaperBackground>
      <div
        v-for="(item, key) in tabPageMap"
        :key="key"
        :class="{ 'tab-bar-item': true, 'active': key + '' === currentTabIndex + '' }"
        @click.left.stop.prevent="handleAction('tabActive', key)"
      >
        <div class="title">{{ item.title }}</div>
        <div class="close" @click.stop.prevent="handleAction('tabClose', key)">
          <Icon type="android-close"></Icon>
        </div>
      </div>
      <!-- 新标签页 -->
      <div class="tab-bar-item new-tab" @click.stop.prevent="handleAction('newTab')">
        <Icon type="android-add-circle"></Icon>
      </div>
    </div>
    <div class="tab-menu">
      <!-- 后退 -->
      <div class="tool-item" @click.stop.prevent="handleAction('backward')">
        <Icon type="android-arrow-back"></Icon>
      </div>
      <!-- 前进 -->
      <div class="tool-item" @click.stop.prevent="handleAction('forward')">
        <Icon type="android-arrow-forward"></Icon>
      </div>
      <!-- 刷新 -->
      <div class="tool-item" @click.stop.prevent="handleAction('refresh')">
        <Icon type="android-refresh"></Icon>
      </div>
      <!-- 首页 -->
      <div class="tool-item" @click.stop.prevent="handleAction('home')">
        <Icon type="android-home"></Icon>
      </div>
      <!-- 地址栏 -->
      <div class="input">
        <Input
          v-model="urlMap[currentTabIndex]"
          placeholder="请输入一个地址，回车访问"
          style="width: 300px"
          :autofocus="true"
          autocomplete="on"
          @on-enter="handleAction('visit')"
        ></Input>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  export default {
    name: 'TabPage',
    data () {
      return {
        urlMap: {}
      }
    },
    computed: {
      ...mapState('Apps/' + moduleName, {
        tabPageMap: state => state.tabPageMap,
        currentTabIndex: state => state.currentTabIndex,
        homePage: state => state.homePage
      })
    },
    watch: {
      currentTabIndex: function (val) {
        let _t = this
        _t.currentTab = JSON.parse(JSON.stringify(_t.tabPageMap[val]))
        _t.urlMap[val] = _t.urlMap[val] || _t.currentTab.url
      }
    },
    methods: {
      handleAction: function (action, val) {
        let _t = this
        switch (action) {
          case 'tabActive':
            // 切换tab页
            _t.$store.commit('Apps/GoFire/tab/active', val)
            break
          case 'tabClose':
            // 删除相应tab的url
            delete _t.urlMap[val]
            // 关闭tab页
            _t.$store.commit('Apps/GoFire/tab/close', val)
            break
          case 'newTab':
            let tabIndex = parseInt(Object.keys(_t.tabPageMap)[Object.keys(_t.tabPageMap).length - 1 > 0 ? Object.keys(_t.tabPageMap).length - 1 : 0]) + 1 + ''
            _t.urlMap[tabIndex] = ''
            // 新建tab页
            _t.$store.commit('Apps/GoFire/tab/add', val)
            break
          case 'visit':
              // 新建tab页
            _t.$store.commit('Apps/GoFire/tab/update', {
              index: _t.currentTabIndex,
              info: {
                ..._t.currentTab,
                url: _t.urlMap[_t.currentTabIndex].replace(/^(https|http|ftp|rtsp|mms)?:?\/?\/?/i, 'http://')
              }
            })
            break
          case 'backward':
            // TODO 浏览器后退
            break
          case 'forward':
            // TODO 浏览器前进
            break
          case 'refresh':
            if (_t.currentTab && _t.currentTab.url) {
              // 刷新tab页
              _t.$utils.bus.$emit('Apps/GoFire/tab/refresh', {
                index: _t.currentTabIndex,
                info: {
                  ..._t.currentTab
                }
              })
            }
            break
          case 'home':
            // 新建tab页
            _t.$store.commit('Apps/GoFire/tab/update', {
              index: _t.currentTabIndex,
              info: {
                ..._t.homePage
              }
            })
            break
        }
      }
    },
    created: function () {
      let _t = this
      _t.currentTab = JSON.parse(JSON.stringify(_t.tabPageMap[_t.currentTabIndex]))
      _t.urlMap[_t.currentTabIndex] = _t.currentTab.url
    }
  }
</script>
