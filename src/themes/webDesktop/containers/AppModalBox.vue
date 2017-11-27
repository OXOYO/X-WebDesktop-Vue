/**
* Created by OXOYO on 2017/6/29.
* 应用弹窗容器
*/
<!--  FIXME 暂弃 -->

<style scoped lang="less" rel="stylesheet/less">
  .app-modal-box {
    display: inline-block;
  }
</style>

<template>
  <div class="app-modal-box">
    <!-- TODO 循环AppModal -->
    <AppModal
      v-for="item in modalList"
      :key="item.app.name"
      :info="item"
    ></AppModal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AppModal from '../components/AppModal.vue'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  export default {
    name: 'AppModalBox',
    components: {
      AppModal
    },
    data () {
      return {
        modalList: [
          {
            name: '',
            id: '',
            index: '',
            size: '',
            isShow: false
          }
        ]
      }
    },
    computed: {
      ...mapState('Platform/' + moduleName, {
        // TODO 从state中获取打开的APP列表
        appModalBox: state => state.components.appModalBox
      })
    }
  }
</script>

