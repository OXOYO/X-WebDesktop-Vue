/**
* Created by OXOYO on 2017/12/24.
*
*/

<style lang="less" rel="stylesheet/less">
  .app-context-menu {
    position: absolute;
    min-width: 120px;
    width: auto !important;
    z-index: 9999;
    /*background: #F0F0F0;*/
    box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, .1);
    .context-menu-group, {
      width: 100%;
      &:after {
        content: ' ';
        width: 90%;
        height: 1px;
        background: #cdcdcd;
        display: block;
        margin-left: 5%;
      }
    }
    .hide-title {
      .ivu-menu-item-group-title {
        display: none;
      }
    }
    .context-menu-item {
      padding: 5px 10px 5px 40px;
      position: relative;
      &:before {
        content: ' ';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 30px;
        bottom: 0;
        width: 1px;
        background-color: #f5f7f9;
      }
      &:hover {
        .context-menu-group-children {
          display: inline-block;
        }
      }
      .context-menu-icon {
        position: absolute;
        top: 10px;
        left: 10px;
      }
      .context-menu-group-children {
        position: absolute;
        display: none;
        background: #fff;

        .context-menu-item {
          width: auto;
        }
      }
    }
  }
</style>

<template>
  <Menu
    v-if="contextMenuInfo.isShow"
    class="app-context-menu"
    theme="light"
    :style="contextMenuStyle"
    @on-select="triggerMenu"
    @click.stop.prevent
    :open-names="['iconSort']"
  >
    <!-- FIXME 可以考虑自定义菜单的实现 -->
    <template
      v-if="contextMenuInfo.list && contextMenuInfo.list.length"
      v-for="item in contextMenuInfo.list"
    >
      <!-- 无子菜单 -->
      <Menu-item
        class="context-menu-item"
        v-if="item.enable && !item.children"
        :name="item.name"
      >
        <Icon
          class="context-menu-icon"
          v-if="item.icon"
          :type="item.icon.type"
          :style="item.icon.style"
        >
        </Icon>
        {{ item.text }}
      </Menu-item>
      <!-- 有子菜单 -->
      <Submenu
        v-if="item.enable && item.children"
        :name="item.name"
        @click.stop.prevent
      >
        <template slot="title">
          <Icon
            class="context-menu-icon"
            v-if="item.icon"
            :type="item.icon.type"
            :style="item.icon.style"
          >
          </Icon>
          {{ item.text }}
        </template>
        <Menu-item
          class="context-menu-item"
          v-for="childItem in item.children"
          v-if="childItem.enable"
          :name="childItem.name"
          :key="childItem.name"
          :style="childItem.style"
        >
          <Icon
            class="context-menu-icon"
            v-if="childItem.icon"
            :type="childItem.icon.type"
            :style="childItem.icon.style"
          >
          </Icon>
          {{ childItem.text }}
        </Menu-item>
      </Submenu>
    </template>
  </Menu>
</template>

<script>
  export default {
    name: 'ContextMenu',
    data () {
      return {
        contextMenuInfo: {
          x: 0,
          y: 0,
          isShow: false
        }
      }
    },
    computed: {
      contextMenuStyle: function () {
        let _t = this
        let x = _t.contextMenuInfo.x !== undefined ? (parseInt(_t.contextMenuInfo.x) > 0 ? parseInt(_t.contextMenuInfo.x) : 0) : 0
        let y = _t.contextMenuInfo.y !== undefined ? (parseInt(_t.contextMenuInfo.y) > 0 ? parseInt(_t.contextMenuInfo.y) : 0) : 0
        let tmpObj = {}
        // 判断是否超出边界
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
          let winHeight = document.documentElement.clientHeight
          let winWidth = document.documentElement.clientWidth
          if (x + 200 > winWidth) {
            tmpObj['right'] = '10px'
          } else {
            tmpObj['left'] = x + 'px'
          }
          if (y + 100 > winHeight) {
            tmpObj['bottom'] = '42px'
          } else {
            tmpObj['top'] = y + 'px'
          }
        }
        return tmpObj
      }
    },
    methods: {
      // 右键菜单触发
      triggerMenu: function (menuName) {
        let _t = this
        // TODO 执行菜单相应操作
        _t.$Message.info('触发菜单: ' + menuName)
        let item = _t.contextMenuInfo.list.filter(item => item.name === menuName)[0]
        console.log('item', item, menuName)
        if (item && item.action && item.action.type) {
          switch (item.action.type) {
            case 'bus':
              console.log('item.action.handler', item.action.handler)
              _t.$utils.bus.$emit(item.action.handler)
              break
          }
        }
        // 关闭菜单
        _t.contextMenuInfo.isShow = false
      }
    },
    created: function () {
      let _t = this
      // TODO 监听菜单打开
      _t.$utils.bus.$on('platform/contextMenu/show', function (val) {
        // 广播事件
        _t.$utils.bus.$emit('platform/startMenu/hide')
        console.log('contextMenu data', val)
        if (val) {
          _t.contextMenuInfo = val
        }
        _t.contextMenuInfo.isShow = true
      })
      _t.$utils.bus.$on('platform/contextMenu/hide', function (val) {
        console.log('contextMenu data', val)
        // 重置 contextMenuInfo
        _t.contextMenuInfo = {
          x: 0,
          y: 0,
          isShow: false
        }
      })
    }
  }
</script>
