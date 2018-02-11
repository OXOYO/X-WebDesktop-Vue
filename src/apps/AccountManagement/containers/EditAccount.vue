/**
* Created by OXOYO on 2017/7/18.
*
* 编辑账号 组件
*/

<style scoped lang="less" rel="stylesheet/less">
  .edit-panel {
    height: 100%;
    width: 100%;
  }
</style>

<template>
  <div class="edit-panel">
    <Row>
      <Col span="12" v-if="!isCurrentEditAccountEmpty">
        <Form ref="accountForm" :model="formData" :rules="formRules" :label-width="80">
          <Form-item label="账号" prop="account">
            <Input v-model="formData.account" placeholder="请输入账号"></Input>
          </Form-item>
          <Form-item label="姓名" prop="name">
            <Input v-model="formData.name" placeholder="请输入姓名"></Input>
          </Form-item>
          <Form-item label="级别" prop="type">
            <Radio-group v-model="formData.type">
              <Radio label="0">管理员</Radio>
              <Radio label="1">普通用户</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="状态" prop="status">
            <Radio-group v-model="formData.status">
              <Radio label="0">停用</Radio>
              <Radio label="1">启用</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="开启应用" prop="apps">
            <Select
              v-model="formData.apps"
              :disabled="formData.type === '0'"
              multiple
              filterable
              placement="top"
              placeholder="请选择要开启的应用"
            >
              <Option v-for="item in appsList" :value="item.id" :key="item.index">{{ item.title }}</Option>
            </Select>
          </Form-item>
          <Form-item>
            <Button type="primary" :loading="doSaveLoading" @click="doSave">保存</Button>
            <Button type="ghost" :loading="doResetLoading" @click="doReset">重置</Button>
          </Form-item>
        </Form>
      </Col>
      <Col span="24">
        <NoData :show="isCurrentEditAccountEmpty">暂无要编辑的数据！</NoData>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  export default {
    name: 'EditAccount',
    data () {
      return {
        // 默认表单数据
        defFormData: {
          account: '',
          name: '',
          type: 1,
          status: 1,
          apps: []
        },
        // 表单数据
        formData: {},
        // 表单校验规则
        formRules: {
          account: [
            {
              required: true,
              message: '请填写账号',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '请填写用户名',
              trigger: 'blur'
            }
          ],
          apps: [
            {
              required: true,
              type: 'array',
              min: 1,
              message: '请至少选择一个应用',
              trigger: 'blur'
            }
          ]
        },
        // 应用列表
        appsList: [],
        // 保存loading
        doSaveLoading: false,
        // 重置loading
        doResetLoading: false,
        // 当前编辑账号是否为空标识
        isCurrentEditAccountEmpty: false
      }
    },
    props: {
      action: {
        type: String,
        default: 'add'
      }
    },
    computed: {
      ...mapState('Apps/' + moduleName, {
        currentEditAccount: state => state.currentEditAccount
      })
    },
    watch: {
      'formData.type': function (val) {
        let _t = this
        let payload = {}
        // 用户类别 0 管理员  1 普通用户
        payload['user_type'] = val
        _t.getApplicationsList(payload)
      }
    },
    methods: {
      // 执行保存
      doSave: async function () {
        let _t = this
        _t.doSaveLoading = true
        // 校验结果
        let validResult = false
        this.$refs['accountForm'].validate((valid) => {
          validResult = valid
          if (!valid) {
            _t.$Message.error('表单验证失败！')
            _t.doSaveLoading = false
          }
        })
        if (!validResult) {
          return
        }
        // 按action类别分别处理
        if (_t.action === 'add') {
          // 分发action，执行保存
          let res = await _t.$store.dispatch('Apps/AccountManagement/account/add', {
            ..._t.formData
          })
          _t.doSaveLoading = false
          if (!res) {
            _t.$Message.error('保存失败！')
            return
          } else if (res.status !== 200) {
            return
          }
          // 处理返回数据
          if (res) {
            _t.$Message.success(res.msg || '保存成功！')
            _t.initFormData()
          }
        } else if (_t.action === 'edit') {
          // 分发action，执行保存
          let res = await _t.$store.dispatch('Apps/AccountManagement/account/edit', {
            ..._t.formData
          })
          _t.doSaveLoading = false
          if (!res) {
            _t.$Message.error('保存失败！')
            return
          } else if (res.status !== 200) {
            return
          }
          // 处理返回数据
          if (res) {
            _t.$Message.success(res.msg || '保存成功！')
            _t.$store.commit('Apps/AccountManagement/currentTab/update', 'search')
          }
        }
      },
      // 执行重置
      doReset: function () {
        let _t = this
        _t.doResetLoading = true
        // 清空表单数据
        _t.initFormData()
        _t.doResetLoading = false
      },
      // 初始化表单数据
      initFormData: function () {
        let _t = this
        _t.formData = {
          ..._t.defFormData
        }
        // TODO 判断当前是新增或编辑来分别处理formData
        if (_t.action === 'edit') {
          if ((Object.keys(_t.currentEditAccount)).length) {
            // 更新标识
            _t.isCurrentEditAccountEmpty = false
            // 更新formData
            _t.formData = {
              ..._t.formData,
              ..._t.currentEditAccount
            }
          } else {
            // 更新标识
            _t.isCurrentEditAccountEmpty = true
          }
        }
      },
      getApplicationsList: async function (payload) {
        let _t = this
        // TODO 拉取应用列表
        let res = await _t.$store.dispatch('Apps/AccountManagement/Apps/all', payload)
        if (!res) {
          _t.$Message.error('查询应用列表失败！')
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
          _t.$Message.success(res.msg || '查询应用列表成功！')
        }
        _t.appsList = resList
      }
    },
    created: async function () {
      let _t = this
      // 初始化表单数据
      _t.initFormData()
//      if (!_t.isCurrentEditAccountEmpty) {
//        _t.getApplicationsList()
//      }
    },
    destroyed: function () {
      let _t = this
      // 清空当前编辑的账号信息
      _t.$store.commit('Apps/AccountManagement/currentEditAccount/update', {})
    }
  }
</script>

