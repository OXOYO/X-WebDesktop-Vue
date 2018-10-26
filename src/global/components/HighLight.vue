/**
* Created by OXOYO on 2018/3/6.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .high-light-block {
    position: relative;
    display: inline-block;
    width: 100%;
    line-height: 1;
    margin-bottom: 10px;
    background: #3f3f3f;

    &:hover {
      .block-header {
        .header-tool {
          display: inline-block;
        }
      }
    }

    &.full-screen {
      height: 100%;
      width: 100vw;
    }

    .block-header {
      display: inline-block;
      width: 100%;
      line-height: 1;
      padding: 5px 0;
      background: #3f3f3f;
      /*border-bottom: 1px solid #e9eaec;*/

      .header-title {
        float: left;
        display: inline-block;
        color: #ccc;
        text-align: right;
        padding: 5px 10px;
        font-weight: 600;
      }

      .header-lang {
        float: right;
        display: inline-block;
        color: #ccc;
        text-align: right;
        font-size: 20px;
        padding: 0 10px;
        font-weight: 600;
      }

      .header-tool {
        display: none;
        white-space: normal;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        line-height: 1;
        background-color: rgba(0, 0, 0, 1);
        padding: 0 10px;

        .tool-btn {
          display: inline-block;
          line-height: normal;

          .tool-tooltip {
            line-height: normal;

            .tool-icon {
              font-size: 20px;
              color: #9F9F9F;
              padding: 5px;

              &:hover {
                color: #FFF;
              }
            }
          }
        }
      }
    }
    .block-body {
      display: inline-block;
      width: 100%;
      height: calc(~"100% - 32px");
      line-height: 1;
      overflow: auto;

      .code-content {
        white-space: pre-wrap;
        word-wrap: break-word;

        &::selection {
          background: #0D6AD9;
        }

        &.nodata {
          color: #f90;
          text-align: center;
        }

        span {
          &::selection {
            background: #0D6AD9;
          }
        }
      }
    }
    pre,
    code {
      line-height: 1.5;
      display: block;
      background: #3f3f3f;
      border: none;
    }
    pre {
      margin: 0;
    }
  }
</style>

<template>
  <div :class="{ 'high-light-block': true, 'full-screen': isFullScreen }" :id="styles" ref="HighLight">
    <div class="block-header">
      <!-- 标题 -->
      <div class="header-title" v-if="title">{{ title }}</div>
      <div class="header-lang" v-if="showLang">{{ lang }}</div>
      <!-- 工具栏 -->
      <div class="header-tool" v-if="tool.length">
        <div v-if="tool.includes('fullScreen')" class="tool-btn" @click.stop="handleAction('fullScreen')">
          <Tooltip class="tool-tooltip" :placement="placement" content="全屏">
            <Icon class="tool-icon" type="arrow-expand"></Icon>
          </Tooltip>
        </div>
        <div v-if="tool.includes('selectAll')" class="tool-btn" @click.stop="handleAction('selectAll')">
          <Tooltip class="tool-tooltip" :placement="placement" content="全选">
            <Icon class="tool-icon" type="grid"></Icon>
          </Tooltip>
        </div>
        <div v-if="tool.includes('copy')" class="tool-btn" @click.stop="handleAction('copy')">
          <Tooltip class="tool-tooltip" :placement="placement" content="复制">
            <Icon class="tool-icon" type="ios-copy"></Icon>
          </Tooltip>
        </div>
      </div>
    </div>
    <div class="block-body" :style="blockBodyStyle">
      <!--<pre><code class="code-content" :class="codeContentClass">{{ data ? data : nodata }}</code></pre>-->
      <pre v-if="codeData"><code class="code-content" :class="codeContentClass" v-html="codeData"></code></pre>
      <pre v-else><code class="code-content" :class="codeContentClass">{{ data ? data : nodata }}</code></pre>
    </div>
  </div>
</template>

<script>
  import hljs from 'highlight.js/lib/highlight'
  import 'highlight.js/styles/zenburn.css'

  ['javascript', 'json', 'sql'].forEach((langName) => {
    let langModule = require(`highlight.js/lib/languages/${langName}`)
    hljs.registerLanguage(langName, langModule)
  })

  export default {
    name: 'HighLight',
    data () {
      return {
        isFullScreen: false,
        codeData: null
      }
    },
    props: {
      data: {},
      styles: {
        type: String,
        // zenburn vs2015 agate
        default: 'zenburn'
      },
      lang: {
        type: String,
        default: 'JavaScript'
      },
      tool: {
        type: Array,
        default: () => ['fullScreen', 'selectAll', 'copy']
      },
      showLang: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ''
      },
      maxHeight: {
        type: Number
      },
      nodata: {
        type: String,
        default: '暂无数据！'
      }
    },
    computed: {
      blockBodyStyle: function () {
        let _t = this
        let obj = {}
        if (!_t.isFullScreen) {
          obj['max-height'] = _t.maxHeight ? _t.maxHeight + 'px' : '19em'
        }
        return obj
      },
      codeContentClass: function () {
        let _t = this
        let obj = {
          [_t.lang]: true
        }
        if (!_t.data) {
          obj['nodata'] = true
        }
        return obj
      },
      placement: function () {
        let _t = this
        return _t.isFullScreen ? 'bottom' : 'top'
      }
    },
    watch: {
      data: {
        handler: function () {
          let _t = this
          _t.render()
        },
        deep: true
      }
    },
    methods: {
      render: function () {
        let _t = this
        _t.codeData = null
        if (_t.data) {
          _t.codeData = _t.data
          setTimeout(function () {
            // _t.$nextTick(function () {
              // 初始化hljs
              // hljs.configure({useBR: true})
            let snippet = _t.$el.querySelector('.high-light-block pre code')
            hljs.highlightBlock(snippet)
            // })
          }, 100)
        }
      },
      handleAction: function (action) {
        let _t = this
        let snippet = _t.$el.querySelector('.high-light-block pre code')
        let handleSelectAll = function () {
          // 获取选区
          let selection = window.getSelection()
          // 选中所有子节点
          selection.selectAllChildren(snippet)
        }
        let handleCopy = function () {
          // 获取选区
          let selection = window.getSelection()
          // 获取选中文本
          let selectedText = selection.toString()
          if (!selectedText) {
            // 选中所有子节点
            selection.selectAllChildren(snippet)
          }
          // 复制
          document.execCommand('copy')
        }
        let handleFullScreen = function () {
          if (!_t.isFullScreen) {
            // 全屏
            // let docElm = document.documentElement
            let docElm = _t.$refs['HighLight']
            if (docElm.requestFullscreen) {
              docElm.requestFullscreen()
            } else if (docElm.mozRequestFullScreen) {
              docElm.mozRequestFullScreen()
            } else if (docElm.webkitRequestFullScreen) {
              docElm.webkitRequestFullScreen()
            } else if (docElm.msRequestFullscreen) {
              docElm.msRequestFullscreen()
            }
          } else {
            // 退出全屏
            if (document.exitFullscreen) {
              document.exitFullscreen()
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen()
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen()
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen()
            }
          }
          _t.isFullScreen = !_t.isFullScreen
        }
        switch (action) {
          case 'fullScreen':
            handleFullScreen()
            break
          case 'selectAll':
            handleSelectAll()
            break
          case 'copy':
            handleCopy()
            break
        }
      },
      loadStyles: function () {
        let _t = this
        if (_t.styles) {
          try {
            // 加载样式
            require('highlight.js/styles/' + _t.styles + '.css')
            console.log('Load', 'highlight.js/styles/' + _t.styles + '.css', 'succeed.')
          } catch (e) {
            console.warn('Load', 'highlight.js/styles/' + _t.styles + '.css', 'failed.')
          }
        }
      },
      loadLang: function () {
        let _t = this
        if (_t.lang) {
          let fileName = _t.lang.toLowerCase()
          try {
            // 加载语言包
            let lang = require('highlight.js/lib/languages/' + fileName + '.js')
            console.log('lang', lang)
            hljs.registerLanguage(_t.lang, lang)
            console.log('Load', 'highlight.js/lib/languages/' + fileName + '.js', 'succeed.')
          } catch (e) {
            console.warn('Load', 'highlight.js/lib/languages/' + fileName + '.js', 'failed.')
          }
        }
      }
    },
    created: function () {
      let _t = this
      // 绑定mouseup事件
      document.onkeyup = function (event) {
        if (event.stopPropagation) {
          event.stopPropagation()
        }
        if (event.preventDefault) {
          event.preventDefault()
        }
        if (event.keyCode === 27 || event.code === 'Escape') {
          _t.isFullScreen = false
        }
      }
    }
  }
</script>

