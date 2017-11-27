/**
* Created by OXOYO on 2017/11/13.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .edit-panel {
    height: 100%;
    width: 100%;
  }
  .upload-icon {
    display: inline-block;

    .upload-icon-preview {
      width: 50px;
      height: 50px;
      display: inline-block;
      border: 1px solid transparent;
      box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, .2);
      border-radius: 2px;
      vertical-align: middle;
      margin-right: 20px;
      overflow: hidden;

      img {
        width: 50px;
        height: 50px;
        margin: -1px;
        border-radius: 2px;
      }
    }
    .upload-icon-main {
      display: inline-block;
      vertical-align: middle;
    }
  }
</style>

<template>
  <div class="edit-panel">
    <Row>
      <Col span="24" v-if="!isCurrentEditAppInfoEmpty">
      <!-- TODO 需要处理多种类型 -->
      <Form ref="appForm" :model="formData" :rules="formRules" :label-width="100">
        <!-- 用户应用 -->
        <Form-item label="应用名称">
          <Input v-model="formData.name" placeholder="请输入应用名称"></Input>
        </Form-item>
        <Form-item label="应用标题">
          <Input v-model="formData.title" placeholder="请输入应用标题"></Input>
        </Form-item>
        <Form-item label="应用描述">
          <Input v-model="formData.description" type="textarea" placeholder="请输入应用描述"></Input>
        </Form-item>
        <Form-item label="应用类别">
          <RadioGroup v-model="formData.type">
            <Radio :label="0">
              <span>默认应用</span>
            </Radio>
            <Radio :label="1">
              <span>普通应用</span>
            </Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="用户类别">
          <RadioGroup v-model="formData.user_type">
            <Radio :label="0">
              <span>管理员</span>
            </Radio>
            <Radio :label="1">
              <span>普通用户</span>
            </Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="发布应用">
          <RadioGroup v-model="formData.publish">
            <Radio :label="0">
              <span>否</span>
            </Radio>
            <Radio :label="1">
              <span>是</span>
            </Radio>
          </RadioGroup>
        </Form-item>
        <!-- config -->
        <!-- TODO 图标上传 -->
        <Form-item label="图标" class="upload-icon">
          <div class="upload-icon-preview">
            <img :src="formData.config.app.icon" :alt="formData.appInfo.title">
          </div>
          <Upload
            class="upload-icon-main"
            :action="uploadConfig.action()"
            :format="uploadConfig.format"
            :max-size="uploadConfig.maxSize"
            :show-upload-list="uploadConfig.showUploadList"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
          >
            <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
          </Upload>
        </Form-item>
        <Form-item label="展现方式">
          <RadioGroup v-model="formData.config.modal.type">
            <Radio label="modal">
              <span>modal</span>
            </Radio>
            <Radio label="iframe">
              <span>iframe</span>
            </Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="网址" v-show="formData.config.modal.type === 'iframe'">
          <Input v-model="formData.config.app.url" placeholder="请输入应用地址"></Input>
        </Form-item>
        <Form-item label="窗口默认大小">
          <RadioGroup v-model="formData.config.modal.size">
            <Radio label="small">
              <span>small</span>
            </Radio>
            <Radio label="middle">
              <span>middle</span>
            </Radio>
            <Radio label="max">
              <span>max</span>
            </Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="允许缩放">
          <CheckboxGroup v-model="formData.config.modal.enableResize">
            <Checkbox label="min">
              <span>min</span>
            </Checkbox>
            <Checkbox label="max">
              <span>max</span>
            </Checkbox>
            <Checkbox label="reset">
              <span>reset</span>
            </Checkbox>
            <Checkbox label="close">
              <span>close</span>
            </Checkbox>
          </CheckboxGroup>
        </Form-item>
        <!-- 任务栏 -->
        <Form-item label="锁定任务栏">
          <RadioGroup v-model="formData.config.taskBar.isPinned">
            <Radio label="true">
              <span>是</span>
            </Radio>
            <Radio label="false">
              <span>否</span>
            </Radio>
          </RadioGroup>
        </Form-item>
        <FormItem >
          <Button type="primary" @click="doSave">保存</Button>
        </FormItem >
      </Form>
      </Col>
      <Col span="24">
      <NoData :show="isCurrentEditAppInfoEmpty">暂无要编辑的数据！</NoData>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Store from '../store/index'
  const moduleName = Store.moduleName
  import Cookies from 'js-cookie'
  import { cookieConfig } from '@/platform/config'

  export default {
    name: 'EditApplication',
    props: {
      action: {
        type: String,
        default: 'add'
      }
    },
    data () {
      let _t = this
      return {
        // 默认表单数据
        defFormData: {
          // appInfo 禁止修改，除非该应用是用户自己添加的
          appInfo: {
            config: '',
            description: '',
            name: '',
            title: '',
            // 应用类型 0：默认应用 1：普通应用
            type: 1
          },
          name: '',
          title: '',
          description: '',
          // 应用类别： 0 默认应用 1 普通应用
          type: 1,
          // 应用状态: 0 已导入未发布 1 已导入并发布
          publish: 1,
          // 用户类别：0 管理员 1 普通用户
          user_type: 1,
          config: {
            app: {
              icon: '/static/app.png',
              index: '',
              url: ''
            },
            modal: {
              type: 'iframe',
              size: 'middle',
              isShow: false,
              zIndex: 600,
              enableResize: ['min', 'max', 'reset', 'close']
            },
            taskBar: {
              // 注意在前端RadioGroup组件上需是字符串
              isPinned: 'false'
            }
          }
        },
        formData: {},
        formRules: {},
        // 当前编辑账号是否为空标识
        isCurrentEditAppInfoEmpty: false,
        uploadConfig: {
          action: () => {
            let url = _t.$utils.Serv.handleUrl('/ApplicationMarket/icon/upload')
            let query = ''
            let token = Cookies.get(cookieConfig.keys.token)
            query = cookieConfig.keys.token + '=' + token
            url = url + '?' + query
            return url
          },
          format: ['jpg', 'jpeg', 'png'],
          maxSize: 20,
          showUploadList: false
        }
      }
    },
    computed: {
      ...mapState('Apps/' + moduleName, {
        currentEditAppInfo: state => state.currentEditAppInfo
      })
    },
    methods: {
      // 初始化表单数据
      initFormData: function () {
        let _t = this
        _t.formData = {
          ..._t.defFormData
        }
        // TODO 判断当前是新增或编辑来分别处理formData
        if (_t.action === 'edit') {
          if ((Object.keys(_t.currentEditAppInfo)).length) {
            // 更新标识
            _t.isCurrentEditAppInfoEmpty = false
            let config = _t.currentEditAppInfo.config ? JSON.parse(_t.currentEditAppInfo.config) : {}
            config['taskBar']['isPinned'] = config['taskBar']['isPinned'] + ''
            // 处理modal.type
            if (!config['modal'].hasOwnProperty('type')) {
              config['modal']['type'] = 'modal'
            }
            // 更新formData
            _t.formData = {
              ..._t.formData,
              ..._t.currentEditAppInfo,
              config: config
            }
          } else {
            // 更新标识
            _t.isCurrentEditAppInfoEmpty = true
          }
        }
      },
      // 执行保存
      doSave: async function () {
        let _t = this
        // 1.处理数据
        // FIXME [BUG] isPinned' of undefined
        let config = {
          ..._t.formData.config,
          taskBar: {
            ..._t.formData.config.taskBar,
            isPinned: _t.formData.config['taskBar']['isPinned'] === 'true'
          }
        }
        let payload = {
          ..._t.formData,
          config: JSON.stringify(config)
        }
        // 2.分发action，执行保存
        let res = await _t.$store.dispatch('Apps/ApplicationMarket/' + _t.action, payload)
        res = _t.$utils.Serv.handleRes(_t, res, true)
        if (!res) {
          _t.$Message.error('保存失败！')
          return
        } else if (res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res) {
          _t.$Message.success(res.msg || '保存成功！')
          // 切换tab页
          _t.$store.commit('Apps/ApplicationMarket/currentTab/update', 'search')
          _t.$nextTick(function () {
            // 刷新应用列表
            _t.$bus.$emit('Apps/ApplicationMarket/list/refresh')
            // 刷新桌面应用列表
            _t.$bus.$emit('webDesktop/application/list/refresh')
          })
        }
      },
      handleFormatError: function () {
        let _t = this
        _t.$Message.error('图片格式错误，仅支持 ' + _t.uploadConfig.format.join('、') + ' ！')
      },
      handleMaxSize: function () {
        let _t = this
        _t.$Message.error('图片太大，请选择小于 ' + _t.uploadConfig.maxSize + 'kb 的图片！')
      },
      handleSuccess: function (res) {
        let _t = this
        if (res) {
          if (res.status === 200) {
            _t.$Message.success(res.msg || '上传成功！')
            // 更新表单数据
            _t.formData.config.app.icon = res.data.url
          }
        } else {
          _t.$Message.error('上传失败！')
        }
      },
      handleBeforeUpload: function () {}
    },
    created: function () {
      let _t = this
      // 初始化表单数据
      _t.initFormData()
    },
    destroyed: function () {
      let _t = this
      // 清空当前编辑的账号信息
      _t.$store.commit('Apps/ApplicationMarket/currentEditAppInfo/update', {})
    }
  }
</script>

