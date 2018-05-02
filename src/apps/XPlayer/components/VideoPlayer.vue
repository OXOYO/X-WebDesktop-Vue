/**
* Created by OXOYO on 2018/4/30.
*
* 基于video.js的视频播放器
*/

<style lang="less" rel="stylesheet/less">
  .video-player {
    display: inline-block;
    width: 100%;
    height: 100%;
    margin: 0 auto;

    .video-js {
      width: 100%;
      height: 100%;

      .vjs-big-play-button {
        display: none;
      }

      * {
        outline: none;
      }
    }
  }
</style>

<template>
  <div class="video-player" v-if="reseted">
    <video class="video-js" ref="video"></video>
  </div>
</template>

<script>
  import videojs from 'video.js'
  import 'video.js/dist/video-js.css'
  import playlist from 'videojs-playlist'

  export default {
    name: 'VideoPlayer',
    data () {
      return {
        // 播放器实例
        player: null,
        reseted: true,
        options: {
          width: '610',
          height: '420',
          error: null,
          autoplay: true,
          controls: true,
          loop: false,
          // 静音
          muted: false,
          poster: '',
          preload: 'auto',
          fluid: true,
          language: 'zh-CN',
          // 播放速率
          playbackRates: [0.5, 1.0, 1.5, 2.0],
          sources: [],
          plugins: {
            playlist: playlist
          }
          /*
          ,
          children: {
            ControlBar: {
              PlayToggle: true,
              VolumePanel: {
                inline: false
              },
              RemainingTimeDisplay: true,
              fullscreenToggle: true
            }
          }
          */
        }
      }
    },
    methods: {
      // 初始化播放器
      init: function () {
        let _t = this
        // 播放器实例
        _t.player = videojs(_t.$refs.video, _t.options, function () {
          // 开始播放
          _t.player.on('play', function (val) {
            console.log('play', val)
          })
          // 暂停播放
          _t.player.on('pause', function (val) {
            console.log('pause', val)
          })
          // 结束播放
          _t.player.on('ended', function (val) {
            console.log('play', val)
          })
          _t.player.on('error', function (val) {
            console.log('error', val)
          })
          _t.player.on('loadeddata', function (val) {
            console.log('loadeddata', val)
          })
        })
      },
      dispose: function (callback) {
        let _t = this
        if (_t.player && _t.player.dispose) {
          if (_t.player.techName_ !== 'Flash') {
            _t.player.pause && _t.player.pause()
          }
          _t.player.dispose()
          _t.player = null
          _t.$nextTick(() => {
            _t.reseted = false
            _t.$nextTick(() => {
              _t.reseted = true
              _t.$nextTick(() => {
                callback && callback()
              })
            })
          })
        }
      }
    },
    created: function () {
      let _t = this
      // 监听事件
      _t.$utils.bus.$on('Apps/XPlayer/video/open', function (videoInfo) {
        _t.options.sources = [{
          type: videoInfo.type,
          src: videoInfo.url
        }]
        console.log('videoInfo', videoInfo)
        _t.dispose(() => {
          _t.init()
        })
      })
    },
    mounted: function () {
      let _t = this
      if (!_t.player) {
        _t.init()
      }
    },
    beforeDestroy: function () {
      let _t = this
      if (!_t.player) {
        _t.dispose()
      }
    }
  }
</script>
