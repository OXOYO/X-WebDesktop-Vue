/**
* Created by OXOYO on 2017/7/4.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .loading{
    width: 80px;
    height: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -40px;
    margin-top: -10px;
  }
  .loading span{
    display: inline-block;
    width: 4px;
    height: 100%;
    border-radius: 4px;
    background: lightgreen;
    animation: load 1s ease infinite;
  }
  @keyframes load{
    0%, 100%{
      height: 20px;
      background: lightgreen;
    }
    50% {
      height: 40px;
      margin: -10px 0;
      background: lightblue;
    }
  }
  .loading span:nth-child(2){
    animation-delay: 0.2s;
  }
  .loading span:nth-child(3){
    animation-delay: 0.4s;
  }
  .loading span:nth-child(4){
    animation-delay: 0.6s;
  }
  .loading span:nth-child(5){
    animation-delay: 0.8s;
  }
</style>

<template>
  <div class="loading" v-if="isLoading">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script>
  export default {
    name: 'Loading',
    props: {
      isLoading: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

