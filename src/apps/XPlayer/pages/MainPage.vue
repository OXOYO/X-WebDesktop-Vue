/**
* Created by OXOYO on 2018/4/23.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: center;
    overflow: hidden;

    .open-video {
      position: absolute;
      z-index: 1000;
      display: inline-block;
      width: 100px;
      height: 30px;
      line-height: 30px;
      top: 50%;
      left: 50%;
      margin-left: -50px;
      margin-top: -50px;

      .open-btn {
        background: #ffffff;
      }
    }
  }
</style>

<template>
  <div
    class="main-page"
    @contextmenu.stop.prevent="handleRightClick($event)"
  >
    <VideoPlayer></VideoPlayer>
    <!--<DVideoPlayer></DVideoPlayer>-->
    <!-- 打开视频 -->
    <Upload
      class="open-video"
      v-show="isShow"
      action=""
      accept="video/*"
      :before-upload="handleOpenVideo"
    >
      <Button ref="openVideoBtn" class="open-btn" type="ghost" icon="ios-cloud-upload-outline">打开文件</Button>
    </Upload>
  </div>
</template>

<script>
  import VideoPlayer from '../components/VideoPlayer'
  import DVideoPlayer from '../components/DVideoPlayer'

  export default {
    name: 'MainPage',
    components: {
      VideoPlayer,
      DVideoPlayer
    },
    data () {
      return {
        // 是否显示
        isShow: true
      }
    },
    methods: {
      // 桌面右键点击
      handleRightClick: function (event) {
        let _t = this
        let xVal = parseInt(event.clientX)
        let yVal = parseInt(event.clientY)
        // 菜单信息
        let contextMenuInfo = {
          isShow: true,
          x: xVal,
          y: yVal,
          target: 'admin',
          list: [
            {
              name: 'openVideo',
              icon: {
                type: '',
                style: ''
              },
              text: '打开文件',
              enable: true,
              action: {
                type: 'callback',
                handler: function () {
                  console.log('_t.$refs[\'openVideoBtn\']', _t.$refs['openVideoBtn'])
                  _t.$refs['openVideoBtn'].$el.click()
                }
              }
            }
          ]
        }
        // 广播事件
        _t.$utils.bus.$emit('platform/contextMenu/show', contextMenuInfo)
      },
      handleOpenVideo: function (file) {
        let _t = this
        let url = window.URL.createObjectURL(file)
        console.log('file', file)
        console.log('url', url)
        let payload = {
          file: file,
          type: file.type,
          url: url
        }
        // 校验文件类型
        _t.isShow = false
        // 广播事件
        _t.$utils.bus.$emit('Apps/XPlayer/video/open', payload)
        return false
      }
    }
  }
</script>
