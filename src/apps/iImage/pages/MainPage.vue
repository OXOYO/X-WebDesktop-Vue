/**
* Created by OXOYO on 2018/8/24.
*
*/

<style lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background: #EAEEF4;

    .open-img {
      background-color: rgba(0,0,0,.5);
      border-radius: 50%;
      cursor: pointer;
      height: 80px;
      overflow: hidden;
      position: absolute;
      z-index: 999;
      left: -40px;
      top: -40px;
      transition: background-color .15s;
      width: 80px;

      &:hover {
        background: rgba(0,0,0,.8)
      }

      input {
        display: none;
      }
      .icon {
        position: absolute;
        right: 15px;
        bottom: 15px;
        color: #ffffff;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
      }
    }
    .img-preview {
      width: 100%;
      display: none;
    }
    .viewer-container {
      width: 100% !important;
      height: 100% !important;
      background: #EAEEF4;

      .viewer-canvas {
        img {
          box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, .1);
        }
      }

      .viewer-navbar {
        background: #EAEEF4;
      }
      .viewer-player {
        background: #EAEEF4;
        cursor: default;
      }
    }
  }
</style>

<template>
  <div class="main-page">
    <div class="open-img" @click="handleOpenImage" title="打开图片">
      <input type="file" name="image" accept="image/*" ref="input" @change="handleFileChange">
      <Icon class="icon" type="image"></Icon>
    </div>
    <div class="img-preview">
      <div class="img-item" v-for="(item, index) in list" :key="index">
        <img :src="item.url">
      </div>
    </div>
  </div>
</template>

<script>
  import 'viewerjs/dist/viewer.min.css'
  import Viewer from 'viewerjs'

  export default {
    name: 'MainPage',
    props: {
      info: {
        type: Object
      }
    },
    data () {
      return {
        viewerInstance: null,
        list: []
      }
    },
    methods: {
      init: function () {
        let _t = this
        _t.initViewer()
      },
      initViewer: function (cllback) {
        let _t = this
        let config = {
          inline: true,
          // navbar: false,
          backdrop: false,
          initialViewIndex: 0
        }
        /* eslint-disable */
        let el = _t.$el.querySelector('.img-preview')
        _t.destroyViewer()
        _t.viewerInstance = new Viewer(el, config)
        /* eslint-enable */
        cllback && cllback()
      },
      destroyViewer: function () {
        let _t = this
        if (_t.viewerInstance) {
          _t.viewerInstance.destroy()
          _t.viewerInstance = null
        }
      },
      showImg: function (index) {
        let _t = this
        if (_t.viewerInstance) {
          _t.viewerInstance.view(index)
        }
      },
      handleOpenImage: function () {
        let _t = this
        _t.$refs.input.click()
      },
      handleFileChange: function (event) {
        let _t = this
        let files = event.target.files
        if (!files.length) {
          return
        }
        let render = new FileReader()
        render.readAsDataURL(files.item(0))
        render.onload = function (e) {
          _t.list.push({
            url: e.target.result
          })
          let img = new Image()
          img.onload = function () {
            _t.viewerInstance.update()
            _t.showImg(_t.list.length - 1)
          }
          img.src = e.target.result
        }
      }
    },
    mounted: function () {
      let _t = this
      _t.init()
    }
  }
</script>
