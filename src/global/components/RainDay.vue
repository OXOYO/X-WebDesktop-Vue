/**
* Created by OXOYO on 2017/9/26.
*
* 雨滴背景
*/

<style scoped lang="less" rel="stylesheet/less">
  .rain-day {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .rain-day-background {
      width: 100%;
      height: 100%;
    }
  }
</style>

<template>
  <div class="rain-day">
    <img id="rainDayBackground" class="rain-day-background" src="../../platform/static/images/rainday_001.jpg"/>
  </div>
</template>

<script>
  import RainyDay from '../lib/rainyday.js'

  export default {
    name: 'RainDay',
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            blur: 20,
            opacity: 1
          }
        }
      },
      rain: {
        type: Array,
        default: () => {
          return [
            {
              drops: [ [1, 2, 8000] ],
              period: null
            },
            {
              drops: [ [3, 3, 0.88], [5, 5, 0.9], [6, 2, 1] ],
              period: 100
            }
          ]
        }
      }
    },
    methods: {
      init: function () {
        let _t = this
        let el = _t.$el
        let img = document.querySelector('#rainDayBackground')
        img.crossOrigin = 'Anonymous'
        img.onload = function () {
          let engine = new RainyDay({
            image: this,
            parentElement: el,
            ..._t.config
          })
          for (let i in _t.rain) {
            let item = _t.rain[i]
            if (item.drops) {
              if (item.period) {
                engine.rain(item.drops, item.period)
              } else {
                engine.rain(item.drops)
              }
            }
          }
        }
      }
    },
    mounted: function () {
      let _t = this
      // 初始化
      _t.init()
    }
  }
</script>

