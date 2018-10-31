/**
* Created by OXOYO on 2017/5/18.
*
*/

<template>
    <span :class="wrapClasses" @click="toggle">
        <span :class="innerClasses">
            <slot name="open" v-if="currentValue"></slot>
            <slot name="close" v-if="!currentValue"></slot>
        </span>
    </span>
</template>
<script>
  const prefixCls = 'ivu-switch'

  export default {
    name: 'USwitch',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      size: {
        validator (value) {
          let validList = ['large', 'small']
          let oneOf = (value, validList) => {
            for (let i = 0; i < validList.length; i++) {
              if (value === validList[i]) {
                return true
              }
            }
            return false
          }

          return oneOf(value, validList)
        }
      },
      beforeToggle: {
        type: Function
      },
      afterToggle: {
        type: Function
      },
      callbackParams: {
        type: null
      }
    },
    data () {
      return {
        currentValue: this.value
      }
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-checked`]: this.currentValue,
            [`${prefixCls}-disabled`]: this.disabled,
            [`${prefixCls}-${this.size}`]: !!this.size
          }
        ]
      },
      innerClasses () {
        return `${prefixCls}-inner`
      }
    },
    methods: {
      toggle: async function () {
        let _t = this
        if (_t.disabled) {
          return false
        }

        let isStopChange = false
        if (_t.beforeToggle) {
          isStopChange = await _t.beforeToggle(_t.callbackParams, _t.currentValue) || false
        }
        if (isStopChange) {
          return false
        }
        _t.currentValue = !_t.currentValue
        _t.afterToggle && _t.afterToggle(_t.callbackParams, _t.currentValue)
      }
    },
    watch: {
      value (val) {
        this.currentValue = val
      }
    }
  }
</script>
