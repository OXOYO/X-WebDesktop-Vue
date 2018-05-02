/**
* Created by OXOYO on 2018/4/30.
*
* 基于DPlayer的视频播放器
*/

<style lang="less" rel="stylesheet/less">
  .video-player {
    display: inline-block;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
</style>

<template>
  <div class="video-player" id="dplayer"></div>
</template>

<script>
  import 'DPlayer/dist/DPlayer.min.css'
  import DPlayer from 'DPlayer'

  export default {
    name: 'DVideoPlayer',
    data () {
      return {
        // 播放器实例
        player: null,
        options: {
          autoplay: false,
          theme: '#FADFA3',
          loop: true,
          lang: 'zh-cn',
          screenshot: true,
          hotkey: true,
          preload: 'auto',
          logo: '',
          volume: 0.7,
          mutex: true,
          video: {
            url: '',
            pic: '',
            thumbnails: '',
            type: 'auto'
          }
          /*
          // 外挂字幕
          subtitle: {
            url: 'dplayer.vtt',
            type: 'webvtt',
            fontSize: '25px',
            bottom: '10%',
            color: '#b7daff'
          },
          */
          /*
          // 弹幕库
          danmaku: {
            id: '9E2E3368B56CDBB4',
            api: 'https://api.prprpr.me/dplayer/',
            token: 'tokendemo',
            maximum: 1000,
            addition: ['https://api.prprpr.me/dplayer/bilibili?aid=4157142'],
            user: 'DIYgod',
            bottom: '15%',
            unlimited: true
          },
          */
          /*
          // 右键菜单
          contextmenu: [
            {
              text: '打开视频',
              click: (player) => {
                console.log(player)
              }
            }
          ]
          */
        }
      }
    },
    methods: {
      init: function () {
        let _t = this
        _t.player = new DPlayer({
          ..._t.options,
          container: document.getElementById('dplayer')
        })
      }
    },
    created: function () {
      let _t = this
      // 监听事件
      _t.$utils.bus.$on('Apps/XPlayer/video/open', function (videoInfo) {
        console.log('videoInfo', videoInfo)
        _t.options.video.url = videoInfo.url
        if (!_t.player) {
          _t.init()
        }
        _t.player.play()
      })
    },
    mounted: function () {
      let _t = this
      if (!_t.player) {
        _t.init()
      }
    }
  }
</script>
