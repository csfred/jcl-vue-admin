<template>
  <div class="haha">哈哈哈哈</div>
</template>

<script>

export default {
  name: 'Name',
  data() {
    return {
    }
  },
  mounted() {
    this.getTest()
  },
  // 方法
  methods: {
    getTest() {
      this.data1 = ''
    }
  }
}
</script>

<style lang='scss' scoped>
.haha{ width: 200px; height: 200px; position:fixed; background: #000000; top:50px; color: #ffffff;}
</style>
