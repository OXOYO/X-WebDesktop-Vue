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
          background: #ffffff;
          color: #3C4043;
        }

        &.new-tab {
          display: inline-block;
          width: 30px;
          font-size: 32px;
          text-align: center;
          flex: none;
          padding: 0;
          background: transparent;
          line-height: initial;
          color: #ffffff;

          &:hover {
            color: #f5f7f9;
            background: transparent;
          }
        }

        &:hover {
          background: #f5f7f9;
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
        :class="{ 'tab-bar-item': true, 'active': key === currentTabIndex }"
        @click.stop.prevent="handleAction('tabActive', key)"
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
      <div class="tool-item">
        <Icon type="android-arrow-back"></Icon>
      </div>
      <!-- 前进 -->
      <div class="tool-item">
        <Icon type="android-arrow-forward"></Icon>
      </div>
      <!-- 刷新 -->
      <div class="tool-item">
        <Icon type="android-refresh"></Icon>
      </div>
      <!-- 首页 -->
      <div class="tool-item">
        <Icon type="android-home"></Icon>
      </div>
      <!-- 地址栏 -->
      <div class="input">
        <Input v-model="currentTab.url" placeholder="请输入一个地址" style="width: 300px" @on-enter="handleAction('site')"></Input>
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
    computed: {
      ...mapState('Apps/' + moduleName, {
        tabPageMap: state => state.tabPageMap,
        currentTabIndex: state => state.currentTabIndex
      }),
      currentTab: function () {
        let _t = this
        return JSON.parse(JSON.stringify(_t.tabPageMap[_t.currentTabIndex]))
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
            // 关闭tab页
            _t.$store.commit('Apps/GoFire/tab/close', val)
            break
          case 'newTab':
            // 新建tab页
            _t.$store.commit('Apps/GoFire/tab/add', val)
            break
          case 'site':
            // TODO 处理url
            // 新建tab页
            _t.$store.commit('Apps/GoFire/tab/update', {
              index: _t.currentTabIndex,
              info: {
                ..._t.currentTab
              }
            })
            break
        }
      }
    }
  }
</script>
