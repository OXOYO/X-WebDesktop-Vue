/**
* Created by OXOYO on 2017/12/24.
*
* 入口文件
*/

<style lang="less" rel="stylesheet/less">
  .app-login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    .main-box {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 280px;
      /*height: 250px;*/
      margin-left: -140px;
      margin-top: -200px;
      box-shadow: 0 0 5px 5px rgba(0, 0, 0, .1);
      background: rgba(255, 255, 255, .1);
      overflow: hidden;

      &:hover,
      &:focus {
        box-shadow: 0 0 2px 2px rgba(0, 0, 0, .2);
      }
    }

    .login-header {
      text-align: center;
      background: #fff;
      height: 129px;

      .avatar-block {
        display: inline-block;
        width: 120px;
        height: 120px;
        margin: 0 auto;
        overflow: hidden;

        .avatar {
          display: inline-block;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
      }
    }
    .login-body {
      text-align: center;
      padding: 30px 15px;

      .login-form {
        /*width: 250px;*/
        margin: 0 auto;
        text-align: left;

        .form-item {
          margin: 24px auto 0;
        }
        input {
          border: none;
        }
        .ivu-input-group-append,
        .ivu-input-group-prepend {
          background: #fff;
          border: none;
        }
      }

      .notice-text {
        display: inline-block;
        margin-top: 20px;
        width: 100%;
        color: #fff;
        text-align: left;
      }
    }

    .login-footer {
      padding: 12px 15px;
      text-align: right;
    }

    input {
      // 解决chrome下表单自动填充导致的input框黄底问题
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
      }
    }
  }
</style>

<template>
  <div class="app-login">
    <div class="main-box">
      <WallpaperBackground></WallpaperBackground>
      <a :href="$Config.System.repository.url" target="_blank">
        <img
          style="position: absolute; top: -2px; right: -2px; border: 0; z-index: 5000"
          src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"
          alt="Fork me on GitHub"
        >
      </a>
      <div class="login-header">
        <div class="avatar-block">
          <img class="avatar" :src="$Config.System.logo" alt="">
        </div>
      </div>
      <div class="login-body">
        <Form class="login-form" ref="signInForm" :model="formData" :rules="signInFormRules">
          <Form-item class="form-item" prop="account">
            <Input type="text" v-model="formData.account" placeholder="请输入用户名">
            </Input>
          </Form-item>
          <Form-item class="form-item" prop="password">
            <Input :type="passwordInputType" v-model="formData.password" placeholder="请输入密码，回车登录" @on-enter="handleSignIn">
            <Button slot="append" :icon="passwordInputType === 'password' ? 'eye-disabled' : 'eye'" style="font-size: 16px; line-height: 1;" @click="showPassword"></Button>
            </Input>
          </Form-item>
        </Form>
        <div class="notice-text">测试账号：admin，密码：123456</div>
      </div>
      <div class="login-footer">
        <Button type="primary" size="large" long :loading="loading" @click="handleSignIn">登录</Button>
      </div>
    </div>
  </div>
</template>

<script>
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
