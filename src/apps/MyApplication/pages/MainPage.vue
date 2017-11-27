/**
* Created by OXOYO on 2017/11/6.
*
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
        <SearchApplication></SearchApplication>
      </Tab-pane>
      <Tab-pane label="新增" name="add" class="main-tab-pane">
        <!-- 账号新增表单 -->
        <EditApplication action="add" v-if="currentTab === 'add'"></EditApplication>
      </Tab-pane>
      <Tab-pane label="编辑" name="edit" class="main-tab-pane">
        <!-- 账号编辑表单 -->
        <EditApplication action="edit" v-if="currentTab === 'edit'"></EditApplication>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
  import SearchApplication from '../containers/SearchApplication.vue'
  import EditApplication from '../containers/EditApplication.vue'
  import { mapState } from 'vuex'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  export default {
    name: 'MainPage',
    components: {
      SearchApplication,
      EditApplication
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
        _t.$store.commit('Apps/MyApplication/currentTab/update', currentTab)
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

