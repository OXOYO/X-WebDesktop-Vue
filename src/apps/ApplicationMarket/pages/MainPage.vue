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
      flex: 0 0 200px;
      height: 100%;
      border-right: 1px solid #dddddd;

      .category-header {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        border-bottom: 1px solid #dddddd;
      }
      .category-body {
        display: inline-block;
        width: 100%;

        .category-list {

          .list-item {
            padding: 5px 0 5px 30px;
            border-bottom: 1px solid #ffffff;

            &:hover,
            &.active {
              background: #cfe3fd;
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
    }
    .app-list-block {
      flex: 1 1 auto;
      height: 100%;

      .list-header {
        display: none;
      }
      .list-body {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
        width: 100%;
        height: 100%;

        .list-item {
          flex: 1 1 auto;
          /*height: 120px;*/
          margin: 10px;
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
      <div class="list-header"></div>
      <div class="list-body">
        <div
          class="list-item"
          v-for="item in applicationList"
          :key="item.name"
        >
          <div class="item-logo">
            <img :src="item.config.app.icon || appIcon" :alt="item.title">
          </div>
          <div class="item-content">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-install" @click="handleApplicationInstall(item)">安装</div>
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
        currentCategory: null
      }
    },
    computed: {
      ...mapState('Platform', {
        appIcon: state => state.appIcon
      })
    },
    methods: {
      init: function () {
        let _t = this
        // 获取应用分类列表
        _t.getCategoryList()
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
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/ApplicationMarket/application/list', {
          category: _t.currentCategory ? _t.currentCategory.id : ''
        })
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
      // 处理应用安装
      handleApplicationInstall: function (item) {
        console.log('handleApplicationInstall', item)
      }
    },
    created: function () {
      let _t = this
      _t.init()
    }
  }
</script>
