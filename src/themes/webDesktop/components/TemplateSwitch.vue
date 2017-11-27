/**
* Created by OXOYO on 2017/7/7.
*
* 模板切换 组件
*/

<style scoped lang="less" rel="stylesheet/less">
  .template-switch {
    position: fixed;
    top: -10px;
    right: 400px;
    z-index: 500;

    .template-list {
      display: inline-block;
      padding: 10px;
      box-shadow: 0 0 5px 5px rgba(0, 0, 0, .1);
      background: #fff;

      .template-list-item {
        position: relative;
        display: inline-block;
        text-align: center;

        .template-active {
          position: absolute;
          bottom: 1px;
          right: 13px;
          color: #47CB89;
          background: #fff;
        }
        img {
          display: block;
          width: 30px;
          height: 30px;
          border: 1px solid #cdcdcd;
          border-radius: 2px;
          margin: 10px 10px 0;

          &:hover {
            border-color: #2d8cf0;
            box-shadow: 0 0 5px 0 #2d8cf0;
          }
        }
        span {
          display: inline-block;
        }
      }
    }

    .template-switch-handler {
      position: absolute;
      top: 0;
      right: -14px;
      height: 60px;

      &:after {
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -1px;
        content: ' ';
        height: 80px;
        width: 2px;
        background: #fff;
      }

      img {
        margin-top: 70px;
        width: 30px;
        height: 30px;
      }
    }
  }
</style>

<template>
  <div
    v-if="isShow"
    class="template-switch"
    :style="switchStyle"
  >
    <!-- 模板列表 -->
    <transition enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <div
        v-if="isShowList"
        class="template-list"
      >
        <div
          v-for="item in templateMap"
          :key="item.name"
          class="template-list-item"
        >
          <img :src="item.icon" :alt="item.title" @click.stop.prevent="handleSwitch(item.name)">
          <!-- <span>{{ item.title }}</span> -->
          <Icon type="android-checkbox" class="template-active" v-if="currentTemplate === item.name"></Icon>
        </div>
        <!-- TODO 列表 -->
      </div>
    </transition>
    <!-- 小手 -->
    <div class="template-switch-handler">
      <img
        class=""
        :src="templateSwitch.icon"
        alt=""
        @mousedown.self="mousedownHandle"
        @mouseup.self="mouseupHandle"
        draggable="true"
        @dragstart="dragStartHandle"
      >
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  // FIXME 应该考虑做成 Widget
  export default {
    name: 'TempalteSwitch',
    data () {
      return {
        templateSwitch: {
          icon: '/static/templateSwitch/clothes.png'
        }
      }
    },
    computed: {
      ...mapState('Platform/' + moduleName, {
        isShow: state => state.components.templateSwitch.isShow,
        isShowList: state => state.components.templateSwitch.isShowList,
        isStartDrag: state => state.components.templateSwitch.isStartDrag,
        currentTemplate: state => state.components.templateSwitch.currentTemplate,
        templateMap: state => state.components.templateSwitch.templateMap,
        switchStyle: state => state.components.templateSwitch.style
      })
    },
    methods: {
      // 拖拽处理
      dragStartHandle: function (event) {
        let _t = this
        // 鼠标点击位置相对拖拽对象位置
        let offsetX = event.offsetX
        let offsetY = event.offsetY

        // 拖拽对象数据
        let targetInfo = {
          type: 'TemplateSwitch',
          data: {
            offsetX: offsetX,
            offsetY: offsetY
          }
        }
        event.dataTransfer.setData('Text', JSON.stringify(targetInfo))
        let tmpInfo = {
          isShowList: false,
          isStartDrag: true,
          style: {
            ..._t.switchStyle,
            top: '-10px'
          }
        }
        // 分发mutation，更新状态
        _t.$store.commit('Platform/webDesktop/components/templateSwitch/update', tmpInfo)
      },
      // 鼠标按下效果
      // FIXME 添加延时操作，防止拖拽后触发。
      mousedownHandle: function () {
        let _t = this
        setTimeout(function () {
          if (!_t.isStartDrag) {
            let tmpInfo = {
              isShowList: !_t.isShowList,
              style: {
                ..._t.switchStyle,
                top: 0
              }
            }
            // 分发mutation，更新状态
            _t.$store.commit('Platform/webDesktop/components/templateSwitch/update', tmpInfo)
          }
        }, 200)
      },
      // 鼠标抬起效果
      mouseupHandle: function () {
        let _t = this
        let tmpInfo = {
          style: {
            ..._t.switchStyle,
            top: '-10px'
          }
        }
        // 分发mutation，更新状态
        _t.$store.commit('Platform/webDesktop/components/templateSwitch/update', tmpInfo)
      },
      // 模板切换
      handleSwitch: function (templateName) {
        let _t = this

        if (templateName === _t.currentTemplate) {
          return
        }
        // 分发mutation，更新状态
        _t.$store.commit('Platform/webDesktop/components/templateSwitch/update', {
          currentTemplate: templateName
        })
      }
    }
  }
</script>
