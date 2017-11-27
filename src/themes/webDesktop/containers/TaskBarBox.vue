/**
* Created by OXOYO on 2017/6/30.
*
* 任务栏容器
*/

<style scoped lang="less" rel="stylesheet/less">
  .task-bar-box {
    position: absolute;
    bottom: 0;
    z-index: 500;
    width: 100%;
    height: 40px;
    display: inline-block;

    .task-bar-box-bg {
      position: absolute;
      bottom: 0;
      z-index: 510;
      width: 100%;
      height: 100%;
      display: inline-block;
      border-top: 1px solid #FFF;
      background: #2A5AAD;
      opacity: .5;
      filter: blur(20px);
      overflow: hidden;
    }

    .task-bar-box-main {
      position: absolute;
      bottom: 0;
      z-index: 520;
      width: 100%;
      height: 100%;
      display: inline-block;
      // #0E2E49
      border-top: 1px solid rgba(14, 46, 73, .3);
      box-sizing: content-box;
    }
    .time-block {
      float: right;
      color: #f5f7f9;
      height: 40px;
      width: 100px;
      display: inline-block;
      /*padding: 0 10px;*/
      text-align: center;

      .time-item {
        display: inline-block;
        width: 100%;
        height: 20px;
      }
    }
  }
</style>

<template>
  <div class="task-bar-box">
    <div class="task-bar-box-bg"></div>
    <div class="task-bar-box-main">
      <!-- TODO Start Menu -->
      <TaskBarIcon :info="startMenuInfo" type="system"></TaskBarIcon>
      <!-- TODO 任务栏图标列表 -->
      <TaskBarIcon
        v-for="item in iconMap"
        :key="item.app.name"
        :info="item"
        type="app"
      ></TaskBarIcon>
      <!-- 时间显示 -->
      <div class="time-block">
        <div class="time-item">{{ timeNow }}</div>
        <div class="time-item">{{ dateNow }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import TaskBarIcon from '../components/TaskBarIcon.vue'
  import Store from '../store/index'
  const moduleName = Store.moduleName

  export default {
    name: 'TaskBarBox',
    components: {
      TaskBarIcon
    },
    data () {
      return {
        dateNow: '',
        timeNow: '',
        int: null
      }
    },
    // TODO 从state拉取任务栏图标信息
    computed: {
      ...mapState('Platform/' + moduleName, {
        // TODO 从state中获取打开的APP列表
        iconMap: state => state.components.taskBarBox.iconMap,
        startMenuInfo: state => state.components.startMenu.info
      })
    },
    methods: {
      getTimeNow: function () {
        let _t = this
        let handleDateNow = () => {
          _t.dateNow = _t.$filters.formatDate((new Date().getTime()), 'yyyy/MM/dd')
        }
        let handleTimeNow = () => {
          _t.timeNow = _t.$filters.formatDate((new Date().getTime()), 'hh:mm:ss')
        }
        setInterval(function () {
          handleDateNow()
          handleTimeNow()
        }, 1000)
      }
    },
    created: function () {
      let _t = this
      _t.getTimeNow()
    }
//    ,
//    destroyed: function () {
//      let _t = this
//      if (_t.int) {
//        clearInterval(_t.int)
//      }
//    }
  }
</script>

