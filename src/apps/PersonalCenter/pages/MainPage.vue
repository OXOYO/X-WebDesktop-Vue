/**
* Created by OXOYO on 2017/10/9.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-box {
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
  <div class="main-box">
    <Tabs :value="currentTab" class="main-tabs" @on-click="handleCurrentTab">
      <Tab-pane label="基本信息" name="BaseInfo" class="main-tab-pane">
        <BaseInfo></BaseInfo>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
  import BaseInfo from '../containers/BaseInfo.vue'

  export default {
    name: 'MainPage',
    components: {
      BaseInfo
    },
    data () {
      return {
        currentTab: 'BaseInfo'
      }
    },
    methods: {
      handleCurrentTab: function (val) {
        let _t = this
        _t.currentTab = val
      }
    }
  }
</script>

