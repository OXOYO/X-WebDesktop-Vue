/**
* Created by OXOYO on 2017/10/9.
*
* 基本信息
*/

<style lang="less" rel="stylesheet/less">
  .edit-disabled {
    input {
      border-top: none;
      border-left: none;
      border-right: none;
    }
  }
</style>

<template>
  <div class="base-info-box">
    <!-- 回显 -->
    <Form v-if="!isEditing" ref="baseInfoViewForm" :model="formData" :label-width="80">
      <Form-item label="账号" prop="account">
        <span>{{ formData.account }}</span>
      </Form-item>
      <Form-item label="姓名" prop="name">
        <span>{{ formData.name }}</span>
      </Form-item>
      <Form-item label="级别" prop="type">
        <Radio-group v-model="formData.type">
          <Radio label="0" v-show="formData.type === 0">管理员</Radio>
          <Radio label="1" v-show="formData.type === 1">普通用户</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="状态" prop="status">
        <Radio-group v-model="formData.status">
          <Radio label="0" v-show="formData.status === 0">停用</Radio>
          <Radio label="1" v-show="formData.status === 1">启用</Radio>
        </Radio-group>
      </Form-item>
      <!-- FIXME 暂时取消已开启应用列表回显
      <Form-item label="开启应用" prop="apps">
        <Select
          v-model="formData.apps"
          :disabled="formData.type === '0'"
          multiple
          placement="top"
          placeholder="请选择要开启的应用"
        >
          <Option v-for="item in appsList" :value="item.id" :key="item.index">{{ item.title }}</Option>
        </Select>
      </Form-item>
      -->
    </Form>
    <!-- 编辑 -->
    <Form v-if="isEditing" ref="baseInfoEditForm" :model="formData" :rules="formRules" :label-width="80">
      <Form-item label="账号" prop="account">
        <Input v-model="formData.account" placeholder="请输入账号" readonly></Input>
      </Form-item>
      <Form-item label="姓名" prop="name">
        <Input v-model="formData.name" placeholder="请输入姓名" readonly></Input>
      </Form-item>
      <Form-item label="级别" prop="type">
        <Radio-group v-model="formData.type">
          <Radio :label="0">管理员</Radio>
          <Radio :label="1">普通用户</Radio>
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
          placement="top"
          placeholder="请选择要开启的应用"
        >
          <Option v-for="item in appsList" :value="item.id" :key="item.index">{{ item.title }}</Option>
        </Select>
      </Form-item>
      <!--
      <Form-item>
        <Button type="primary" :loading="doSaveLoading" @click="doSave">保存</Button>
        <Button type="ghost" :loading="doResetLoading" @click="doReset">重置</Button>
      </Form-item>
      -->
    </Form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'BaseInfo',
    data () {
      return {
        isEditing: false,
        // 表单数据
        formData: {
          account: '',
          name: '',
          type: 1,
          status: 1,
          apps: []
        },
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
              type: 'array',
              min: 1,
              message: '请选择至少一个应用',
              trigger: 'blur'
            }
          ]
        },
        appsList: []
      }
    },
    computed: {
      ...mapState('Platform', {
        userInfo: state => state.userInfo
      })
    },
    methods: {
      getInfo: async function () {
        let _t = this
        // 分发action，获取信息
        let res = await _t.$store.dispatch('Apps/PersonalCenter/BaseInfo', {
          userId: _t.userInfo.id
        })
        res = _t.$utils.Serv.handleRes(_t, res, true)
        if (!res) {
          _t.$Message.error('获取用户基本信息失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res.data) {
          _t.$Message.success(res.msg || '获取用户基本信息成功！')
          _t.formData = res.data
        } else {
          _t.$Message.info('暂无数据！')
        }
      }
    },
    created: function () {
      let _t = this
      _t.getInfo()
    }
  }
</script>

