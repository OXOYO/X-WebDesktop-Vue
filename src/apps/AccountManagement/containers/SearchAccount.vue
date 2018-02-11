/**
* Created by OXOYO on 2017/7/5.
* 账号管理 查询组件
*/

<style scoped lang="less" rel="stylesheet/less">
  /* 查询面板 */
  .search-panel {

    .search-form {
      border-bottom: 1px solid #d7dde4;
    }
    .search-form-table {
      margin-top: 10px;
      width: 100%;
    }
    .search-form-page{
      float:right;
      margin-top:10px;
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
      <FormItem >
        <Input
          v-model="searchForm.keywords"
          :placeholder="searchForm.filterType === 'account' ? '请输入账号' : '请输入姓名'"
          @on-enter.stop.prevent="doSearch"
        >
        <Select v-model="searchForm.filterType" slot="prepend" style="width: 80px">
          <Option value="account">账号</Option>
          <Option value="name">姓名</Option>
        </Select>
        </Input>
      </FormItem >
      <FormItem >
        <CheckboxGroup v-model="searchForm.userStatus">
          <Checkbox :label="1">
            <span>启用</span>
          </Checkbox>
          <Checkbox :label="0">
            <span>停用</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem >
      <FormItem >
        <CheckboxGroup v-model="searchForm.userType">
          <Checkbox :label="1">
            <Icon type="ios-person-outline"></Icon>
            <span>普通用户</span>
          </Checkbox>
          <Checkbox :label="0">
            <Icon type="ios-person"></Icon>
            <span>管理员</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem >
      <FormItem >
        <Button type="primary" @click="doSearch">查询</Button>
      </FormItem >
    </Form>
    <Table
      class="search-form-table"
      v-if="tableData.length"
      :data="tableData"
      :columns="tableColumns"
      @on-selection-change="handleRowSelect"
    ></Table>
    <Page
      class="search-form-page"
      v-if="pageInfo.total"
      :total="pageInfo.total"
      :current="pageInfo.currentPage"
      placement="top"
      show-sizer
      show-elevator
      show-total
      @on-change="pageChange"
      @on-page-size-change="pageSizeChange"
    ></Page>
    <NoData :show="!pageInfo.total"></NoData>
    <Button-group class="btn-group" v-if="pageInfo.total">
      <Button type="ghost" :disabled="!selectedRowData || !selectedRowData.length" @click="doRemove">删除</Button>
      <Button type="primary" :disabled="!selectedRowData || selectedRowData.length !== 1" @click="doEdit">编辑</Button>
    </Button-group>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  export default {
    name: 'SearchAccount',
    data () {
      let _t = this
      return {
        searchForm: {
          keywords: '',
          filterType: 'account',
          userStatus: [0, 1],
          userType: [0, 1]
        },
        tableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '账号',
            key: 'account'
          },
          {
            title: '用户名',
            key: 'name'
          },
          {
            title: '级别',
            key: 'type',
            render: (h, params) => {
              let content = params.row.type === 1 ? '普通用户' : '管理员'
              let iconType = params.row.type === 1 ? 'ios-person-outline' : 'ios-person'
              return h('div',
                [
                  h('Icon', {
                    props: {
                      type: iconType || ''
                    },
                    style: {
                      fontSize: '20px',
                      marginRight: '10px',
                      verticalAlign: 'middle'
                    }
                  }),
                  h('span', {
                    style: {
                      verticalAlign: 'middle'
                    }
                  }, content || '')
                ]
              )
            }
          },
          {
            title: '启用/停用',
            key: 'status',
            render: function (h, params) {
              return h('USwitch',
                {
                  props: {
                    size: 'large',
                    callbackParams: params.index,
                    beforeToggle: _t.switchAccountStatus,
                    value: !!params.row.status
                  }
                },
                [
                  h('span', {
                    slot: 'open'
                  }, '启用'),
                  h('span', {
                    slot: 'close'
                  }, '停用')
                ]
              )
            }
          },
          {
            title: '创建时间',
            key: 'create_time',
            render: (h, params) => {
              return _t.$utils.filters.formatDate((new Date(params.row['create_time'])).getTime())
            }
          },
          {
            title: '更新时间',
            key: 'update_time',
            render: (h, params) => {
              return _t.$utils.filters.formatDate((new Date(params.row['update_time'])).getTime())
            }
          }
        ],
        tableData: [],
        // 分页信息
        pageInfo: {
          currentPage: 1,
          total: 0,
          pageSize: 10
        },
        // 选中行信息
        selectedRowData: []
      }
    },
    computed: {
      ...mapState('Apps/' + moduleName, {
        currentTab: state => state.currentTab
      })
    },
    watch: {
      currentTab: function (val, oldVal) {
        let _t = this
        if (val === 'search') {
          // TODO 更新账号列表
          _t.initAccountList()
        }
      }
    },
    methods: {
      // 执行查询
      doSearch: function (event) {
        let _t = this
        // 查询用户列表
        _t.initAccountList()
        return false
      },
      // 初始化列表，获取第一页数据
      initAccountList: function (isResetSearchForm) {
        let _t = this
        // 初始化分页
        _t.pageInfo = {
          currentPage: 1,
          total: 0,
          pageSize: 10
        }
        // 处理查询条件
        if (isResetSearchForm) {
          _t.searchForm = {
            keywords: '',
            filterType: 'account',
            userStatus: [0, 1],
            userType: [0, 1]
          }
        }
        // 调接口，初始化数据
        _t.getAccountList()
      },
      getAccountList: async function () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/AccountManagement/account/list', {
          currentPage: _t.pageInfo.currentPage,
          pageSize: _t.pageInfo.pageSize,
          keywords: _t.searchForm.keywords,
          filterType: _t.searchForm.filterType,
          userStatus: _t.searchForm.userStatus,
          userType: _t.searchForm.userType
        })
        if (!res) {
          _t.$Message.error('查询用户列表失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res.data.count && res.data.list && res.data.list.length) {
          _t.$Message.success(res.msg || '查询账号列表成功！')
        } else {
          _t.$Message.info('暂无数据！')
        }
        // 更新表格数据
        _t.tableData = res.data.list || []
        // 更新分页信息
        _t.pageInfo.total = res.data.count || 0
      },
      // 切换账号状态
      switchAccountStatus: async function (index, oldStatus) {
        let _t = this
        // 处理参数
        if (index !== null) {
          let item = _t.tableData[index]
          // 准备参数执行状态更新
          let res = await _t.$store.dispatch('Apps/AccountManagement/account/edit', {
            ...item,
            // 0 停用 1 启用
            status: oldStatus ? 0 : 1
          })
          if (!res) {
            _t.$Message.error(oldStatus ? '停用失败！' : '启用失败！')
            return true
          } else if (res.status !== 200) {
            return true
          }
          // 处理返回数据
          if (res) {
            _t.$Message.success(oldStatus ? '停用成功！' : '启用成功！')
            return false
          }
        } else {
          return true
        }
      },
      handleRowSelect: function (selection) {
        let _t = this
        _t.selectedRowData = selection
      },
      pageChange (pageNum) {
        let _t = this
        // 更新当前页
        _t.pageInfo.currentPage = pageNum
        // 调接口，初始化数据
        _t.getAccountList()
      },
      pageSizeChange: function (pageSize) {
        let _t = this
        // 更新分页量
        _t.pageInfo.pageSize = pageSize
        // 调接口，初始化数据
        _t.getAccountList()
      },
      doRemove: function () {
        let _t = this
        // 无选中项直接返回
        if (!_t.selectedRowData || !_t.selectedRowData.length) {
          return
        }
        // 删除用户列表中所选用户
        _t.$Modal.confirm({
          title: '提示',
          content: '确认删除所选账号吗？',
          onOk: async function () {
            let tmpArr = []
            for (let i = 0, len = _t.selectedRowData.length, item; i < len; i++) {
              item = _t.selectedRowData[i]
              // 获取所有需要删除用户的账号
              tmpArr.push(item.id)
            }
            if (!tmpArr.length) {
              _t.$Message.info('暂无有效的删除数据！')
              return
            }
            let res = await _t.$store.dispatch('Apps/AccountManagement/account/remove', tmpArr)
            if (!res) {
              _t.$Message.error('删除账号失败！')
              return
            } else if (res.status !== 200) {
              return
            }
            _t.$Message.info(res.msg || '删除账号成功！')
            // TODO 更新账号列表
            _t.initAccountList()
          }
        })
      },
      doEdit: async function () {
        let _t = this
        // 无选中项直接返回
        if (!_t.selectedRowData || !_t.selectedRowData.length) {
          return
        }
        let item = _t.selectedRowData[0] || null
        if (!item) {
          return
        }
        // 处理apps
        let tmpArr = []
        for (let appItem of item.apps) {
          tmpArr.push(appItem['app_id'])
        }
        item.apps = tmpArr
        // TODO 将当前选中行信息存入state
        _t.$store.commit('Apps/AccountManagement/currentEditAccount/update', item)
        // 切换tab页
        _t.$store.commit('Apps/AccountManagement/currentTab/update', 'edit')
      }
    }
  }
</script>

