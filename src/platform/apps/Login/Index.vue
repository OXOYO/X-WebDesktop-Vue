/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style scoped lang="less" rel="stylesheet/less">
  .app-login {
    position: relative;
    vertical-align: middle;
    max-width: 300px;
    margin: 0 auto;
    background: transparent;
    padding: 15px;
    margin-top: 100px;
    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, .1);
    overflow: hidden;

    .wallpaper-image {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(255, 255, 255, .1);
      filter: blur(20px);
      margin: -30px;
      z-index: -1;
    }

    .login-modal-header {
      height: auto;
      text-align: center;
      .login-logo {
        display: block;
        width: auto;
        margin: 0 auto;
      }
      .login-title {
        display: inline-block;
        cursor: default;
        width: 100%;
        padding-top: 10px;
        font-size: 26px;
        font-weight: bolder;
        color: rgb(52, 117, 207);
      }
    }
    .login-modal-body {
      .login-form {
      }
    }
  }
</style>

<template>
  <Row>
    <Col
      :xs="{ span: 20, offset: 2 }"
      :sm="{ span: 10, offset: 7 }"
      :md="{ span: 8, offset: 8 }"
      :lg="{ span: 6, offset: 9 }"
    >
      <div class="app-login">
        <div
          class="wallpaper-image"
          :style="currentWallpaper.type === 'images' ? currentWallpaper.style : ''"
        >
        </div>
        <div class="login-modal-header">
          <img class="login-logo" :src="$Config.System.logo" :alt="$Config.System.title">
        </div>
        <div class="login-modal-body">
          <Form class="login-form" ref="signInForm" :model="formData" :rules="signInFormRules">
            <Form-item prop="account">
              <Input type="text" v-model="formData.account" placeholder="请输入用户名">
              <Icon type="ios-person-outline" slot="prepend" style="font-size: 16px;"></Icon>
              </Input>
            </Form-item>
            <Form-item prop="password">
              <Input :type="passwordInputType" v-model="formData.password" placeholder="请输入密码" @on-enter="handleSignIn">
              <Icon type="ios-locked-outline" slot="prepend" style="font-size: 16px;"></Icon>
              <Button slot="append" :icon="passwordInputType === 'password' ? 'eye-disabled' : 'eye'" style="font-size: 16px; line-height: 1;" @click="showPassword"></Button>
              </Input>
            </Form-item>
          </Form>
        </div>
      </div>
    </Col>
  </Row>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Login',
    data () {
      return {
        // 是否显示video
//        showVideo: false,
        // 是否显示登录弹窗
        showSignInModal: true,
        loading: false,
        // 表单数据
        formData: {
          account: '',
          password: ''
        },
        signInFormRules: {
          account: [
            { required: true, message: '请填写用户名', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'change' },
            { type: 'string', min: 6, max: 16, message: '密码长度必须在6到16位之间', trigger: 'change' }
          ]
        },
        // 密码输入框类型
        passwordInputType: 'password'
      }
    },
    computed: {
      ...mapState('Platform/Wallpaper', {
        currentWallpaper: state => state.currentWallpaper
      })
    },
    methods: {
      triggerMenu: function (routerName) {
        let _t = this
        if (routerName === 'SignIn') {
          _t.showSignInModal = true
          _t.passwordInputType = 'password'
          _t.loading = false
        }
      },
      handleSignIn: async function () {
        let _t = this
        // 调用接口执行登录
        let types = _t.$utils.store.getType('Login/doSignIn', 'Platform')
        console.log('types', types)
        let res = await _t.$store.dispatch(types, {
          account: _t.formData.account.trim(),
          password: _t.formData.password.trim()
        })
        if (!res || res.status !== 200) {
          return
        }
        let userInfo = res.data.userInfo || null
        let tokenKey = _t.$Config.Cookie.getItem('token')
        let token = res.data[tokenKey] || null
        if (userInfo && token) {
          _t.$Message.success('登录成功！')
          // TODO 用户信息存入state；token存入sessionStorage；路由跳转
          _t.$store.commit(_t.$utils.store.getType('userInfo/update', 'Platform'), {
            ...userInfo,
            isLogin: true
          })
          let pathKey = process && process.env.NODE_ENV !== 'production' ? 'development' : 'production'
          _t.$Cookies.set(tokenKey, token, { path: _t.$Config.Cookie.path[pathKey] })
        } else {
          _t.$Message.error('登录失败，接口返回数据异常！')
        }
      },
      showPassword: function () {
        let _t = this
        _t.passwordInputType = _t.passwordInputType === 'password' ? 'text' : 'password'
      }
    }
  }
</script>
