/**
* Created by OXOYO on 2017/11/17.
*
* 分屏预览
*/

<style scoped lang="less" rel="stylesheet/less">
  .split-screen {
    position: absolute;
    z-index: 1999;
    transition: all .2s ease-in;

    .content {
      display: inline-block;
      width: calc(~"100% - 20px");
      height: calc(~"100% - 20px");
      margin: 10px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 5px 5px rgba(0, 0, 0, .5);
    }
    .ripple {
      position: absolute;
      width: 40px;
      height: 40px;
      /*background: #b8e0e0;*/
      background: #ffffff;
      border-radius: 100%;
      transform: scale(0);

      &.animate {
        animation: ripple .2s linear;
      }
    }
    @keyframes ripple {
      100% {opacity: 0; transform: scale(2.5);}
    }

  }
</style>

<template>
  <div
    v-show="isShow"
    class="split-screen"
    :class="data.type"
    :style="splitScreenStyle"
  >
    <div
      class="ripple"
      :class="{'animate': isEnableRipple}"
      :style="rippleStyle"
    >
    </div>
    <div class="content"></div>
  </div>
</template>

<script>
  export default {
    name: 'SplitScreen',
    data () {
      return {
        isShow: false,
        isEnableRipple: false,
        splitScreenStyle: {},
        rippleStyle: {}
      }
    },
    props: {
      data: {
        type: Object,
        required: true,
        default: () => {
          return {
            enable: false,
            // 分屏模式
            type: ''
          }
        }
      }
    },
    watch: {
      data: {
        handler: function (val) {
          let _t = this
          if (val.enable && val.type) {
            _t.isShow = true
            if (!Object.keys(_t.splitScreenStyle).length) {
              _t.splitScreenStyle = {
                top: val.mousePosition.y + 'px',
                right: val.range.maxX - val.mousePosition.x + 'px',
                bottom: val.range.maxY - val.mousePosition.y + 40 + 'px',
                left: val.mousePosition.x + 'px'
              }
              switch (val.type) {
                case 'left-top':
                  _t.rippleStyle = {
                    top: '-20px',
                    left: '-20px'
                  }
                  break
                case 'left-bottom':
                  _t.rippleStyle = {
                    top: 'calc(100% - 20px)',
                    left: '-20px'
                  }
                  break
                case 'right-top':
                  _t.rippleStyle = {
                    top: '-20px',
                    left: 'calc(100% - 20px)'
                  }
                  break
                case 'right-bottom':
                  _t.rippleStyle = {
                    top: 'calc(100% - 20px)',
                    left: 'calc(100% - 20px)'
                  }
                  break
                case 'left':
                  _t.rippleStyle = {
                    top: val.mousePosition.y - 20 + 'px',
                    left: '-20px'
                  }
                  break
                case 'right':
                  _t.rippleStyle = {
                    top: val.mousePosition.y - 20 + 'px',
                    right: '-20px'
                  }
                  break
                case 'top':
                  _t.rippleStyle = {
                    top: '-20px',
                    left: val.mousePosition.x - parseInt(val.style.left) - 20 + 'px'
                  }
                  break
                case 'bottom':
                  _t.rippleStyle = {
                    top: 'calc(100% - 20px)',
                    left: val.mousePosition.x - parseInt(val.style.left) - 20 + 'px'
                  }
                  break
                case 'full-screen':
                  _t.rippleStyle = {
                    top: '-20px',
                    left: val.mousePosition.x - 20 + 'px'
                  }
                  break
              }
            }
            setTimeout(function () {
              let splitScreenStyle = {}
              let bodyWidth = document.body.clientWidth
              let bodyHeight = document.body.clientHeight - 40
              switch (val.type) {
                case 'left-top':
                  splitScreenStyle = {
                    top: 0,
                    left: 0,
                    width: bodyWidth / 2 + 'px',
                    height: bodyHeight / 2 + 'px'
                  }
                  break
                case 'left-bottom':
                  splitScreenStyle = {
                    top: bodyHeight / 2 + 'px',
                    left: 0,
                    width: bodyWidth / 2 + 'px',
                    height: bodyHeight / 2 + 'px'
                  }
                  break
                case 'right-top':
                  splitScreenStyle = {
                    top: 0,
                    left: bodyWidth / 2 + 'px',
                    width: bodyWidth / 2 + 'px',
                    height: bodyHeight / 2 + 'px'
                  }
                  break
                case 'right-bottom':
                  splitScreenStyle = {
                    top: bodyHeight / 2 + 'px',
                    left: bodyWidth / 2 + 'px',
                    width: bodyWidth / 2 + 'px',
                    height: bodyHeight / 2 + 'px'
                  }
                  break
                case 'left':
                  splitScreenStyle = {
                    top: 0,
                    left: 0,
                    width: bodyWidth / 2 + 'px',
                    height: bodyHeight + 'px'
                  }
                  break
                case 'right':
                  splitScreenStyle = {
                    top: 0,
                    left: bodyWidth / 2 + 'px',
                    width: bodyWidth / 2 + 'px',
                    height: bodyHeight + 'px'
                  }
                  break
                case 'top':
                case 'bottom':
                  splitScreenStyle = {
                    top: 0,
                    left: val.style.left,
                    width: val.style.width,
                    height: bodyHeight + 'px'
                  }
                  break
                case 'full-screen':
                  splitScreenStyle = {
                    top: 0,
                    left: 0,
                    width: bodyWidth + 'px',
                    height: bodyHeight + 'px'
                  }
                  break
              }
              _t.splitScreenStyle = splitScreenStyle
              setTimeout(function () {
                _t.isEnableRipple = true
              }, 200)
            }, 0)
          } else {
            _t.isShow = false
            _t.isEnableRipple = false
            _t.splitScreenStyle = {}
          }
        },
        deep: true
      }
    },
    created: function () {
      let _t = this
      // 监听 window 分屏
      _t.$utils.bus.$on('platform/window/splitScreen/hide', function (tmpInfo) {
        _t.isShow = false
      })
    }
  }
</script>
