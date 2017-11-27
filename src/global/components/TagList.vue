/**
* Created by OXOYO on 2017/5/26.
*
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div class="tag-list">
    <Tag v-for="item in list"
       :closable="item.closable"
       :type="item.type"
       :color="item.color"
       :name="item.name"
       :key="item"
       @on-close="typeof item.onClose === 'function' ? item.onClose : () => {}"
    >{{ item.content }}</Tag>
  </div>
</template>

<script>
  export default {
    name: 'TagList',
    props: {
      list: {
        type: Array,
        require: true
      }
    }
  }
</script>

