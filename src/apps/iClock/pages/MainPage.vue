/**
* Created by OXOYO on 2018/8/20.
*
*/

<style lang="less" rel="stylesheet/less">
  .main-page {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .clock {
    position: absolute;
    opacity: 1;
  }

  .fill .clock {
    left: 50%;
    top: 50%;
  }

  .centre {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
  }

  .expand {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }

  .anchor {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
  }

  .element {
    position: absolute;
    top: 0;
    left: 0;
  }

  .round {
    border-radius: 296px;
  }

  .circle-1 {
    background: white;
    width: 12px;
    height: 12px;
  }

  .circle-2 {
    background: #FA9F22;
    width: 8px;
    height: 8px;
  }

  .circle-3 {
    background: black;
    width: 4px;
    height: 4px;
  }

  .second {
    transform: rotate(180deg);
  }

  .minute {
    transform: rotate(54deg);
  }

  .second-hand {
    width: 2px;
    height: 164px;
    background: #FA9F22;
    transform: translate(-50%,-100%) translateY(24px);
  }

  .hour {
    transform: rotate(304.5deg);
  }

  .thin-hand {
    width: 4px;
    height: 50px;
    background: white;
    transform: translate(-50%,-100%);
  }

  .fat-hand {
    width: 10px;
    height: 57px;
    border-radius: 10px;
    background: white;
    transform: translate(-50%,-100%) translateY(-18px);
  }

  .minute-hand {
    height: 112px;
  }

  .hour-text {
    position: absolute;
    font: 40px Hei, Helvetica, Arial, sans-serif;
    color: white;
    transform: translate(-50%,-50%);
  }

  .hour-10 {
    padding-left: 0.4ex;
  }
  .hour-11 {
    padding-left: 0.25ex;
  }

  .minute-text {
    position: absolute;
    font: 12px Avenir Next, Helvetica, Arial, sans-serif;
    color: white;
    transform: translate(-50%,-50%);
  }

  .minute-line {
    background: white;
    width: 1px;
    height: 9px;
    transform: translate(-50%,-100%) translateY(-131px);
    opacity: 0.34;
  }
</style>

<template>
  <div class="main-page">
    <div class="fill">
      <div class="reference"></div>
      <div class="clock" id="utility-clock">
        <div class="centre">
          <div class="dynamic"></div>
          <div class="expand round circle-1"></div>
          <div class="anchor hour">
            <div class="element thin-hand"></div>
            <div class="element fat-hand"></div>
          </div>
          <div class="anchor minute">
            <div class="element thin-hand"></div>
            <div class="element fat-hand minute-hand"></div>
          </div>
          <div class="anchor second">
            <div class="element second-hand"></div>
          </div>
          <div class="expand round circle-2"></div>
          <div class="expand round circle-3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MainPage',
    methods: {
      init: function () {
        let _t = this
        let clock = _t.$el.querySelector('#utility-clock')
        utilityClock(clock)

        function utilityClock (container) {
          let dynamic = container.querySelector('.dynamic')
          let hourElement = container.querySelector('.hour')
          let minuteElement = container.querySelector('.minute')
          let secondElement = container.querySelector('.second')
          let minute = function (n) {
            return n % 5 === 0 ? minuteText(n) : minuteLine(n)
          }
          let minuteText = function (n) {
            let element = document.createElement('div')
            element.className = 'minute-text'
            element.innerHTML = (n < 10 ? '0' : '') + n
            position(element, n / 60, 135)
            dynamic.appendChild(element)
          }
          let minuteLine = function (n) {
            let anchor = document.createElement('div')
            anchor.className = 'anchor'
            let element = document.createElement('div')
            element.className = 'element minute-line'
            rotate(anchor, n)
            anchor.appendChild(element)
            dynamic.appendChild(anchor)
          }
          let hour = function (n) {
            let element = document.createElement('div')
            element.className = 'hour-text hour-' + n
            element.innerHTML = n
            position(element, n / 12, 105)
            dynamic.appendChild(element)
          }
          let position = function (element, phase, r) {
            let theta = phase * 2 * Math.PI
            element.style.top = (-r * Math.cos(theta)).toFixed(1) + 'px'
            element.style.left = (r * Math.sin(theta)).toFixed(1) + 'px'
          }
          let rotate = function (element, second) {
            element.style.transform = element.style.webkitTransform = 'rotate(' + (second * 6) + 'deg)'
          }
          let animate = function () {
            let now = new Date()
            let time = now.getHours() * 3600 +
              now.getMinutes() * 60 +
              now.getSeconds() * 1 +
              now.getMilliseconds() / 1000
            rotate(secondElement, time)
            rotate(minuteElement, time / 60)
            rotate(hourElement, time / 60 / 12)
            requestAnimationFrame(animate)
          }
          for (let i = 1; i <= 60; i++) minute(i)
          for (let i = 1; i <= 12; i++) hour(i)
          animate()
        }
      }
    },
    mounted: function () {
      let _t = this
      _t.init()
    }
  }
</script>
