/**
* Created by OXOYO on 2017/7/5.
* 账号管理 主内容组件
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    overflow: auto;

    .main-tabs {
      width: 100%;
      padding-bottom: 40px;

      .main-tab-pane {
        width: 100%;
        height: 100%;
        padding: 0 20px;
      }
    }
  }
</style>

<template>
  <div class="main-page">
    <Tabs v-model="currentTab" class="main-tabs" @on-click="handleCurrentTab">
      <Tab-pane label="查询" name="search" class="main-tab-pane">
        <SearchAccount></SearchAccount>
      </Tab-pane>
      <Tab-pane label="新增" name="add" class="main-tab-pane">
        <!-- 账号新增表单 -->
        <EditAccount action="add" v-if="currentTab === 'add'"></EditAccount>
      </Tab-pane>
      <Tab-pane label="编辑" name="edit" class="main-tab-pane">
        <!-- 账号编辑表单 -->
        <EditAccount action="edit" v-if="currentTab === 'edit'"></EditAccount>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
  import SearchAccount from '../containers/SearchAccount.vue'
  import EditAccount from '../containers/EditAccount.vue'
  import { mapState } from 'vuex'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  export default {
    name: 'MainPage',
    components: {
      SearchAccount,
      EditAccount
    },
    computed: {
      ...mapState('Apps/' + moduleName, {
        currentTab: state => state.currentTab
      })
    },
    methods: {
      handleCurrentTab: function (currentTab) {
        let _t = this
        // 切换tab页
        _t.$store.commit('Apps/AccountManagement/currentTab/update', currentTab)
      }
    },
    created: function () {
      let _t = this
      _t.$nextTick(function () {
        _t.handleCurrentTab('search')
      })
    }
  }
</script>

