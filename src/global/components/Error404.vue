/**
* Created by OXOYO on 2017/12/8.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .error-404 {
    margin: 0 auto;
    position: absolute;
    z-index: 1500;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);
    text-align: center;
    padding-top: 15%;
  }
  .error-404-code div {
    display: inline-block;
  }
  .error-404-code:first-child {
    text-align: center;
    font-family: cursive;
    font-size: 150px;
    font-weight: bold;
    letter-spacing: 5px;
    color: #fff;
    display: inline;
  }

  .error-404-code:first-child div {
    cursor: default;
    text-shadow: 0px 0px 2px #686868,
    0px 1px 1px #ddd,
    0px 2px 1px #d6d6d6,
    0px 3px 1px #ccc,
    0px 4px 1px #c5c5c5,
    0px 5px 1px #c1c1c1,
    0px 6px 1px #bbb,
    0px 7px 1px #777,
    0px 8px 3px rgba(100, 100, 100, 0.4),
    0px 9px 5px rgba(100, 100, 100, 0.1),
    0px 10px 7px rgba(100, 100, 100, 0.15),
    0px 11px 9px rgba(100, 100, 100, 0.2),
    0px 12px 11px rgba(100, 100, 100, 0.25),
    0px 13px 15px rgba(100, 100, 100, 0.3);
    transition: all .1s linear;
  }

  .error-404-code:first-child div:hover {
    text-shadow: 0px 0px 2px #686868,
    0px 1px 1px #fff,
    0px 2px 1px #fff,
    0px 3px 1px #fff,
    0px 4px 1px #fff,
    0px 5px 1px #fff,
    0px 6px 1px #fff,
    0px 7px 1px #777,
    0px 8px 3px #fff,
    0px 9px 5px #fff,
    0px 10px 7px #fff,
    0px 11px 9px #fff,
    0px 12px 11px #fff,
    0px 13px 15px #fff;
    transition: all .1s linear;
  }

  .error-404-code:not(:first-child) {
    text-align: center;
    color: #666;
    font-family: cursive;
    font-size: 20px;
    text-shadow: 0 1px 0 #fff;
    letter-spacing: 1px;
    line-height: 2em;
    margin-top: -50px;
  }
  .error-404-text {
    margin: 0 auto;
    color: #fff;
    font-size: 20px;
    text-shadow: 0 1px 0 #666;
    letter-spacing: 1px;
    line-height: 2em;
  }
</style>

<template>
  <div class="error-404">
    <div class="error-404-code">
      <div>4</div><div>0</div><div>4</div>
    </div>
    <div class="error-404-text">该页面不存在(´･ω･`)</div>
    <div class="error-404-btn">
      <Button type="dashed" shape="circle">
        <router-link :to="{ name: 'platform.index'}">返回首页</router-link>
      </Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Error404'
  }
</script>

