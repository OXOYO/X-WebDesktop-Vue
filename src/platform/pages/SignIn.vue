/**
* Created by OXOYO on 2017/7/13.
*
* 系统登录页
*/

<style scoped lang="less" rel="stylesheet/less">
  body {
    overflow: hidden;
  }
  .layout {
    background: #f5f7f9;
    height: 100%;
    width: 100%;
    border: none;

    .layout-head {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: transparent;
      z-index: 2000;

      .ivu-menu-item {
        color: #fff;
        &:hover {
          color: #000;
        }
      }
    }
  }
  .layout-logo {
    width: 200px;
    height: 30px;
    line-height: 30px;
    text-align: left;
    /*background: #5b6270;*/
    color: #FFFFFF;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;

    a {
      color: #ffffff;

      &:hover {
        color: #cdcdcd;
      }
    }
  }
  .layout-nav {
    float: right;
    margin: 0 auto;

    li {
      &:hover {
        color: #cdcdcd !important;
      }
    }
  }
  .layout-assistant {
    width: 300px;
    margin: 0 auto;
    height: inherit;
  }
  .layout-breadcrumb {
    padding: 10px 15px 0;
  }
  .layout-content {
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    margin: 0;
    min-height: 200px;
    overflow: hidden;
    background: #fff;
    /*border-radius: 4px;*/

    .layout-video {
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .layout-shade {
      position: absolute;
      z-index: 1000;
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, .1);
    }
  }
  .layout-content-main {
    padding: 10px;
  }
  .layout-copy {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .particles-background {
    background: #383838;
    height: 100%;
    width: 100%;
  }
  .login-modal {

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
  <!-- 系统首页 -->
  <div class="layout">
    <Menu class="layout-head" mode="horizontal" theme="dark" @on-select="triggerMenu">
      <div class="layout-logo">
        <router-link :to="{ name: 'platform.index'}">{{ systemConfig.title }}</router-link>
      </div>
      <div class="layout-nav">
        <Menu-item name="SignIn">
          <Icon type="log-in"></Icon>
          登录
        </Menu-item>
        <Menu-item name="about">
          <Icon type="ios-keypad"></Icon>
          关于
        </Menu-item>
      </div>
    </Menu>
    <div class="layout-content">
      <!-- FIXME 考虑把轮播图改成particles -->
      <!--<x-particles class="particles-background" id="particlesBackground"></x-particles>-->
      <!-- 雨滴背景 -->
      <!--<RainDay></RainDay>-->
      <!-- 壁纸 -->
      <Wallpaper></Wallpaper>
      <Modal
        class="login-modal"
        :closable="false"
        :mask-closable="true"
        v-model="showSignInModal"
        title="登录"
      >
        <div slot="header" class="login-modal-header">
          <img class="login-logo" src="../static/images/logo.png" :alt="systemConfig.title">
          <div class="login-title">{{ systemConfig.subtitle }}</div>
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
              <Button slot="append" :icon="passwordInputType === 'password' ? 'eye' : 'eye-disabled'" style="font-size: 16px; line-height: 1;" @click="showPassword"></Button>
              </Input>
            </Form-item>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" :loading="loading" @click="handleSignIn">登录</Button>
        </div>
      </Modal>
    </div>
    <div class="layout-copy">
      © 2017
    </div>
  </div>
</template>

<script>
  import * as Cookies from 'js-cookie'
  import { cookieConfig, systemConfig } from '../config'

  export default {
    name: 'SignIn',
    data () {
      return {
        systemConfig,
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
        let res = await _t.$store.dispatch('Platform/user/signIn', {
          account: _t.formData.account.trim(),
          password: _t.formData.password.trim()
        })
        res = _t.$utils.Serv.handleRes(_t, res, true)
        if (!res) {
          _t.$Message.error('登录失败！')
        } else if (res.status !== 200) {
          return true
        }
        let userInfo = res.data.userInfo || null
        let token = res.data[cookieConfig.keys.token] || null
        if (userInfo && token) {
          _t.$Message.success('登录成功！')
          // TODO 用户信息存入state；token存入sessionStorage；路由跳转
          _t.$store.commit('Platform/user/update', userInfo)
//          sessionStorage.setItem(cookieConfig.keys.token, token)
          Cookies.set(cookieConfig.keys.token, token)
          _t.$nextTick(function () {
            _t.$router.push({name: 'platform.index'})
          })
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
