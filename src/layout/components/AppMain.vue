<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  width: 100%;
  position: absolute;
  overflow: hidden;
  height: calc(100% - 10px);
  padding: 10px;
  margin-top: 10px;
}
.fixed-header+.app-main {
  padding-top: 36px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.mobile-main .app-main{  
  position: relative;
}
</style>
