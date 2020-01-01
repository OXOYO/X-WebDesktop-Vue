/**
* Created by OXOYO on 2017/8/17.
*
* 面板 组件
*/

<style lang="less" rel="stylesheet/less">
  .u-panel {
    display: inline-block;
    width: 100%;
    margin: 5px 0;

    .u-panel-header {
      height: 38px;
      line-height: 38px;
      padding: 0 32px;
      color: #666;
      width: 100%;
      background: #f5f7f9;

      .header-left {
        display: inline-block;
        float: left;

        .u-panel-title {
          cursor: default;
        }
      }
      .header-right {
        display: inline-block;
        float: right;

        .panel-header {
          display: inline-block;
          float: right;

          .action-btn {
            display: inline-block;

            .action-icon {
              font-size: 18px;
              padding: 2px;
              color: #2d8cf0;
              border: 1px solid transparent;
              width: 22px;
              vertical-align: middle;

              &:hover {
                color: #57a3f3;
                border-color: #57a3f3;
              }
            }
            &.action-text {
              color: #2d8cf0;
              padding: 10px;
              cursor: pointer;
              &:hover {
                color: #57a3f3;
                font-size: 1.2em;
              }
            }
          }
        }
      }
    }
    .u-panel-body {
      display: inline-block;
      width: 100%;
      background: #ffffff;
      padding: 16px;
      transition: all 1s ease-in;
    }
    .u-panel-fold {
      display: none;
    }
  }
</style>

<template>
  <div class="u-panel" :name="name">
    <div class="u-panel-header" @click="handleToggle">
      <div class="header-left">
        <slot name="header-left">
          <div class="u-panel-title">
            <Icon type="chevron-up" v-show="enableFold && !isFolded"></Icon>
            <Icon type="chevron-down" v-show="enableFold && isFolded"></Icon>
            {{ title }}
          </div>
        </slot>
      </div>
      <div class="header-right">
        <slot name="header-right"></slot>
      </div>
    </div>
    <div class="u-panel-body" v-show="!isFolded">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UPanel',
    props: {
      title: {
        type: String
      },
      enableFold: {
        type: Boolean,
        default: false
      },
      name: {
        type: String
      }
    },
    data () {
      return {
        // 是否已折叠
        isFolded: false
      }
    },
    methods: {
      handleToggle: function () {
        let _t = this
        if (!_t.enableFold) {
          return
        }
        // 处理面板折叠
        _t.isFolded = !_t.isFolded
      }
    }
  }
</script>
