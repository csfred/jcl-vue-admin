<template>
  <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-input
      ref="headerSearchSelect"
      v-model.lazy="keywords"
      placeholder="公司、代码"
      class="header-search-select"
      @keyup.enter.native="submit"
    />
  </div>
</template>

<script>
export default {
  name: 'HeaderSearch',
  data() {
    return {
      show: false,
      keywords: ''
    }
  },
  computed: {
  },
  watch: {
    show(value) {
      if (value) {
        // document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
    // keywords(newval) {
    // this.$router.push({ path: `/stock/list?keywords=${newval}` })
    // }
  },
  mounted() {
  },
  methods: {
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    submit() {
      this.$router.push({ path: `/stock/list?keywords=${this.keywords}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  .search-icon {
    cursor: pointer;
    font-size: 14px;
    vertical-align: middle;
  }
  .header-search-select {
    font-size: 14px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }
  &.show {
    .header-search-select {
      width:150px;
      margin-left: 10px;
    }
  }
}
</style>
