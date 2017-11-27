/**
* Created by OXOYO on 2017/7/17.
* 应用信息 组件
*/

<style scoped lang="less" rel="stylesheet/less">
  .application {
    display: inline-block;
    width: 100%;
    padding: 5px;

    .application-main {
      width: 100%;
      border: 1px solid #cdcdcd;
      border-radius: 2px;
    }

    .application-header {
      display: inline-block;
      width: 100%;
      height: 25px;
      line-height: 25px;
      text-align: left;
      padding-left: 15px;
    }
    .application-body {
      height: 140px;
      padding: 5px 15px;
      border-top: 1px solid #cdcdcd;

      .application-tag-list {
        margin-bottom: 5px;
      }
      .application-description {
        word-break: break-all;
      }
    }
    .application-footer {
      height: 35px;
      line-height: 30px;
      padding: 0 15px;
      text-align: right;
    }
  }
</style>

<template>
  <div class="application">
    <div class="application-main">
      <div class="application-header">{{ info.app_title }}</div>
      <div class="application-body">
        <TagList class="application-tag-list" :list="tagList"></TagList>
        <div class="application-description">{{ info.app_description }}</div>
      </div>
      <div class="application-footer">
        <!--<Button style="margin-right: 10px" type="primary" size="small" @click="handleAction('openApp')">打开</Button>-->
        <Button style="margin-right: 10px" type="primary" size="small" @click="handleAction('config')">配置</Button>
        <!-- TODO 绑定相应操作方法 -->
        <Button type="primary" size="small" v-if="info.status === 0" :disabled="!info.app_type" @click="handleAction('enable', true)">启用</Button>
        <Button type="warning" size="small" v-if="info.status === 1" :disabled="!info.app_type" @click="handleAction('disable', true)">停用</Button>
        <Button type="error" size="small" :disabled="!info.app_type" @click="handleAction('uninstall', true)">卸载</Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Application',
    data () {
      return {
        tagList: []
      }
    },
    props: {
      info: {
        type: Object,
        default: () => {
          return {
//            icon: '',
//            title: '',
//            name: '',
//            id: '',
//            index: '',
//            status: '',
//            config: ''
          }
        },
        required: true
      }
    },
    methods: {
      // 处理状态: 启用、停用、卸载
      handleAction: function (actionName, isConfirm) {
        let _t = this
        let handle = () => {}
        let confirmText = ''
        let payload = {
          id: _t.info.id,
          userId: _t.info['user_id'],
          appId: _t.info['app_id']
        }
        // 判断操作类型
        switch (actionName) {
          // 打开
          case 'openApp':
            handle = () => {
              _t.doOpenApp()
            }
            break
          // 配置
          case 'config':
            handle = () => {
              _t.goEditApp()
            }
            break
          // 启用
          case 'enable':
            payload['status'] = 1
            confirmText = '确认启用？'
            handle = () => {
              _t.doUpdateApp(actionName, payload)
            }
            break
          // 停用
          case 'disable':
            payload['status'] = 0
            confirmText = '确认停用？'
            handle = () => {
              _t.doUpdateApp(actionName, payload)
            }
            break
          // 卸载
          case 'uninstall':
            confirmText = '确认卸载？'
            handle = () => {
              _t.doRemoveApp(payload)
            }
            break
        }
        if (isConfirm) {
          _t.$Modal.confirm({
            title: '提示',
            content: confirmText,
            onOk: () => {
              handle()
            }
          })
        } else {
          handle()
        }
      },
      // 执行打开应用操作
      doOpenApp: function () {
        console.log('TODO doOpenApp...')
      },
      // 跳转编辑应用
      goEditApp: function () {
        let _t = this
        // TODO 将当前选中行信息存入state
        _t.$store.commit('Apps/MyApplication/currentEditAppInfo/update', _t.info)
        // 切换tab页
        _t.$store.commit('Apps/MyApplication/currentTab/update', 'edit')
      },
      // 执行更应用操作
      doUpdateApp: async function (actionName, payload) {
        let _t = this
        // 分发action，更新app
        let res = await _t.$store.dispatch('Apps/MyApplication/update', payload)
        res = _t.$utils.Serv.handleRes(_t, res, true)
        if (!res) {
          _t.$Message.error(actionName === 'enable' ? '启用失败！' : '停用失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res) {
          _t.$Message.success(res.msg || '更新成功！')
          // 刷新应用列表
          _t.$bus.$emit('Apps/MyApplication/list/refresh')
          // 刷新桌面应用列表
          _t.$bus.$emit('webDesktop/application/list/refresh')
        }
      },
      // 执行卸载应用操作
      doRemoveApp: async function (payload) {
        let _t = this
        // 分发action，移除app
        let res = await _t.$store.dispatch('Apps/MyApplication/remove', payload)
        res = _t.$utils.Serv.handleRes(_t, res, true)
        if (!res) {
          _t.$Message.error('卸载失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res) {
          _t.$Message.success(res.msg || '卸载成功！')
          // 刷新应用列表
          _t.$bus.$emit('Apps/MyApplication/list/refresh')
          // 刷新桌面应用列表
          _t.$bus.$emit('webDesktop/application/list/refresh')
        }
      }
    },
    created: function () {
      // TODO 解析config
      let _t = this
      let tmpArr = []
      if (_t.info) {
        tmpArr.push({
          closable: false,
          type: 'border',
          color: _t.info.app_type ? 'blue' : 'yellow',
          name: '',
          content: _t.info.app_type ? '普通应用' : '默认应用'
        })
      }
      _t.tagList = tmpArr
    }
  }
</script>

