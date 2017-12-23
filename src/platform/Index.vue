/**
* Created by OXOYO on 2017/12/24.
*
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div>
    <!-- 前台 -->
    <Home>
      <Login></Login>
    </Home>
    <!-- 后台 -->
    <Admin>
      <Desktop>
        <DesktopIcon></DesktopIcon>
        <DesktopWidget></DesktopWidget>
        <TaskBar>
          <StartMenu></StartMenu>
          <TaskBarIcon></TaskBarIcon>
          <TaskBarWidget></TaskBarWidget>
        </TaskBar>
        <Window></Window>
      </Desktop>
    </Admin>
    <ContextMenu></ContextMenu>
  </div>
</template>

<script>
  export default {
      name: "Index"
  }
</script>
