/**
* Created by OXOYO on 2017/11/13.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .search-panel {

    .search-form {
      border-bottom: 1px solid #d7dde4;
    }
    .search-result {
      width: 100%;
      margin-top: 10px;
    }
    .btn-group {
      margin: 10px;
    }
  }
</style>

<template>
  <div class="search-panel">
    <Form
      class="search-form"
      inline
      :model="searchForm"
      @submit.native.prevent
    >
      <FormItem>
        <Input
          v-model="searchForm.keywords"
          placeholder="请输入应用名称"
          @on-enter.stop.prevent="doSearch"
        >
        </Input>
      </FormItem>
      <FormItem v-show="userInfo.type === 0">
        <CheckboxGroup v-model="searchForm.type">
          <Checkbox :label="0">
            <span>默认应用</span>
          </Checkbox>
          <Checkbox :label="1">
            <span>普通应用</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem v-show="userInfo.type === 0">
        <CheckboxGroup v-model="searchForm.user_type">
          <Checkbox :label="0">
            <span>管理员</span>
          </Checkbox>
          <Checkbox :label="1">
            <span>普通用户</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem v-show="userInfo.type === 0">
        <CheckboxGroup v-model="searchForm.publish">
          <Checkbox :label="0">
            <span>未发布</span>
          </Checkbox>
          <Checkbox :label="1">
            <span>已发布</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="doSearch">查询</Button>
      </FormItem>
    </Form>
    <!-- TODO 应用列表 -->
    <div class="search-result">
      <Row>
        <Col span="8" v-for="item in appList" :key="item">
        <Application :info="item"></Application>
        </Col>
      </Row>
      <NoData :show="!appList.length"></NoData>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Application from '../components/Application.vue'

  export default {
    name: 'SearchApplication',
    components: {
      Application
    },
    data () {
      return {
        searchForm: {
          keywords: '',
          filterType: 'title',
          // 应用类别
          type: [0, 1],
          // 用户类别
          user_type: [0, 1],
          // 是否发布
          publish: [0, 1]
        },
        appList: []
      }
    },
    computed: {
      ...mapState('Platform', {
        userInfo: state => state.userInfo
      })
    },
    methods: {
      doSearch: async function () {
        let _t = this
        let res = await _t.$store.dispatch('Apps/ApplicationMarket/list', _t.searchForm)
        res = _t.$utils.Serv.handleRes(_t, res, true)
        if (!res) {
          _t.$Message.error('获取应用列表失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res.data.count === 0) {
          _t.$Message.info('暂无数据！')
        }

        let resList = res.data.list || []
        if (resList.length) {
          _t.$Message.success(res.msg || '获取应用列表成功！')
        }
        _t.appList = resList
      }
    },
    created: function () {
      let _t = this
      // 获取应用列表
      _t.doSearch()
      // 监听
      _t.$bus.$on('Apps/ApplicationMarket/list/refresh', function () {
        // 刷新应用列表
        _t.doSearch()
      })
    },
    beforeDestroy: function () {
      let _t = this
      _t.$bus.$off('Apps/ApplicationMarket/list/refresh')
    }
  }
</script>

