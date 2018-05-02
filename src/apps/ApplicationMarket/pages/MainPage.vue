/**
* Created by OXOYO on 2018/4/20.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;

    .category-block {
      flex: 0 0 120px;
      height: 100%;
      border-right: 1px solid #dddddd;

      .category-header {
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        border-bottom: 1px solid #dddddd;
      }
      .category-body {
        display: inline-block;
        width: 100%;

        .category-list {

          .list-item {
            padding: 10px 0 10px 20px;
            border-bottom: 1px solid #ffffff;

            &:hover,
            &.active {
              background: #0CCC6C;

              .item-icon,
              .item-title {
                color: #ffffff;
              }
            }

            .item-icon {
              display: inline-block;
              width: 20px;
              height: 20px;
              line-height: 20px;
              vertical-align: middle;
              color: #BFBFBF;
            }
            .item-title {
              display: inline-block;
              height: 20px;
              line-height: 20px;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .app-list-block {
      flex: 1 1 auto;
      height: 100%;

      .list-header {
        display: inline-block;
        width: 100%;

        .board-block {
          display: flex;
          width: 100%;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #dddddd;

          .board-item {
            flex: 1 1 auto;
            height: 40px;
            line-height: 40px;
            text-align: center;

            &:hover,
            &.active {
              background: #0CCC6C;

              .item-icon,
              .item-title {
                color: #ffffff;
              }
            }

            .item-icon {
              display: inline-block;
              width: 20px;
              height: 20px;
              line-height: 20px;
              vertical-align: middle;
            }
            .item-title {
              display: inline-block;
              height: 20px;
              line-height: 20px;
              vertical-align: middle;
            }
          }
        }
      }
      .list-body {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
        width: 100%;
        /*height: 100%;*/

        .list-item {
          flex: 0 0 auto;
          height: 68px;
          margin: 5px;
          padding: 10px;

          &:hover {
            background: #ebf7ff;

            .item-content {
              .item-install {
                display: inline-block;
              }
            }
          }

          .item-logo {
            display: inline-block;
            width: 48px;
            height: 48px;
            margin: 0 5px;
            vertical-align: top;

            img {
              width: 100%;
            }
          }
          .item-content {
            display: inline-block;
            width: 100px;
            height: 100%;
            overflow: hidden;
            position: relative;

            .item-title {
              display: inline-block;
              width: 100%;
              height: 20px;
              line-height: 20px;
            }
            .item-install {
              display: none;
              position: absolute;
              bottom: 0;
              padding: 2px 10px;
              background: #5ED2FF;
              color: #ffffff;
              cursor: default;

              &:hover {
                background: #73D7FE;
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="main-page">
    <div class="category-block">
      <div class="category-header">应用分类</div>
      <div class="category-body">
        <div class="category-list">
          <div
            v-for="item in categoryList"
            :class="{ 'list-item': true, 'active': currentCategory.id === item.id }"
            :key="item.name"
            @click="handleCategoryTrigger(item)"
          >
            <Icon class="item-icon" :type="item.icon"></Icon>
            <div class="item-title">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="app-list-block">
      <!-- FIXME 可以考虑分类下还存在子分类的情况 -->
      <div class="list-header">
        <div class="board-block">
          <div
            v-for="item in boardList"
            :class="{ 'board-item': true, 'active': currentBoard.name === item.name }"
            :key="item.name"
            @click="handleBoardTrigger(item)"
          >
            <Icon v-if="item.icon" class="item-icon" :type="item.icon"></Icon>
            <div class="item-title">{{ item.title }}</div>
          </div>
        </div>
      </div>
      <div class="list-body">
        <div
          class="list-item"
          v-for="item in applicationList"
          :key="item.name || item.app_name"
        >
          <div class="item-logo">
            <img :src="item.config.app.icon || appIcon" :alt="item.title || item.app_title">
          </div>
          <div class="item-content">
            <div class="item-title">{{ item.title || item.app_title}}</div>
            <div class="item-install" @click.stop.prevent="handleAction(item, currentBoard.action.name)">{{ currentBoard.action.text }}</div>
          </div>
        </div>
        <NoData :show="!applicationList.length">该分类下暂无应用！</NoData>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'MainPage',
    data () {
      return {
        // 分类列表
        categoryList: [],
        // 应用列表
        applicationList: [],
        // 当前激活的分类
        currentCategory: null,
        boardList: [
          {
            name: 'treasury',
            icon: '',
            title: '宝库',
            action: {
              name: 'install',
              text: '安装'
            }
          },
          {
            name: 'uninstall',
            icon: '',
            title: '卸载',
            action: {
              name: 'uninstall',
              text: '卸载'
            }
          }
        ],
        // 当前激活的board
        currentBoard: null
      }
    },
    computed: {
      ...mapState('Platform', {
        appIcon: state => state.appIcon
      }),
      ...mapState('Platform/Admin', {
        appData: state => state.appData
      })
    },
    methods: {
      init: async function () {
        let _t = this
        _t.currentBoard = _t.boardList[0]
        // 获取应用分类列表
        await _t.getCategoryList()
        // 依据当前激活的分类获取应用列表
        _t.getApplicationList()
      },
      // 获取应用分类列表
      getCategoryList: async function (parent) {
        let _t = this
        // 父分类ID，默认查询父节点为0的一级分类
        parent = parent || 0
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/ApplicationMarket/category/list', {
          parent: parent
        })
        if (!res) {
          _t.$Message.error('查询应用分类列表失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res.data.count && res.data.list && res.data.list.length) {
          _t.$Message.success(res.msg || '查询应用分类列表成功！')
        } else {
          _t.$Message.info('暂无数据！')
        }
        // 更新应用分类列表数据
        _t.categoryList = res.data.list || []
        // 更新当前分类信息
        _t.currentCategory = _t.categoryList[0]
      },
      // 依据当前激活的分类获取应用列表
      getApplicationList: async function () {
        let _t = this
        let path = ''
        let payload = {}
        // 获取当前board下的应用列表
        switch (_t.currentBoard.name) {
          case 'treasury':
            // 获取应用列表
            path = 'Apps/ApplicationMarket/application/list'
            payload = {
              category: _t.currentCategory ? _t.currentCategory.id : ''
            }
            break
          case 'uninstall':
            // 获取用户应用数据
            path = _t.$utils.store.getType('Admin/user/application/list', 'Platform')
            payload = {
              app_category: _t.currentCategory ? _t.currentCategory.id : ''
            }
            break
        }
        // 分发action，调接口
        let res = await _t.$store.dispatch(path, payload)
        if (!res) {
          _t.$Message.error('查询应用列表失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res.data.count && res.data.list && res.data.list.length) {
          _t.$Message.success(res.msg || '查询应用列表成功！')
        } else {
          _t.$Message.info('暂无数据！')
        }
        // 更新应用列表数据
        let applicationList = res.data.list || []
        _t.applicationList = applicationList.map(item => {
          item.config = JSON.parse(item.config)
          return item
        })
      },
      // 处理分类点击事件
      handleCategoryTrigger: function (item) {
        let _t = this
        _t.currentCategory = item
        // 获取当前分类下的应用列表
        _t.getApplicationList()
      },
      // 处理应用安装/卸载
      handleAction: function (appInfo, action) {
        let _t = this
        // 处理安装
        let handleInstall = function () {
          // 安装信息
          let installInfo = {}
          let iconList = [..._t.appData.iconList]
          // 查找单个索引
          let findAppIndex = function (iconList, condition) {
            return iconList.findIndex((item) => {
              return condition(item)
            })
          }
          let currentAppIndex = findAppIndex(iconList, (item) => item.config.app.name === appInfo.config.app.name)
          if (currentAppIndex < 0) {
            installInfo = {
              // 解构应用基础配置
              ...appInfo,
              config: {
                ...appInfo.config,
                // 解构应用安装配置
                ...appInfo.config.install
              },
              // 应用ID
              appID: appInfo.id,
              // 赋值当前操作为 install
              action: 'install',
              // 是否已安装过
              installed: false
            }
          } else {
            let currentApp = iconList[currentAppIndex]
            installInfo = {
              // 解构应用基础配置
              ...currentApp,
              config: {
                ...currentApp.config,
                // 解构应用安装配置
                ...appInfo.config.install
              },
              // 应用ID
              appID: appInfo.id,
              // 赋值当前操作为 install
              action: 'install',
              // 是否已安装过
              installed: true
            }
          }
          // 调用安装工具，打开安装界面
          _t.$utils.install(_t, installInfo)
        }
        // 处理卸载
        let handleUninstall = function () {
          // 调用安装工具，打开安装界面
          _t.$utils.install(_t, {
            // 解构应用基础配置
            ...appInfo,
            config: {
              ...appInfo.config,
              // 解构应用卸载配置
              ...appInfo.config.uninstall
            },
            // 赋值当前操作为 uninstall
            action: 'uninstall',
            // 是否已安装过
            installed: true
          })
        }
        switch (action) {
          case 'install':
            handleInstall()
            break
          case 'uninstall':
            handleUninstall()
            break
        }
      },
      // 处理board点击事件
      handleBoardTrigger: function (item) {
        let _t = this
        _t.currentBoard = item
        // 获取当前分类下的应用列表
        _t.getApplicationList()
      }
    },
    created: function () {
      let _t = this
      _t.init()
    }
  }
</script>
