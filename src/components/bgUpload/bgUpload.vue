<template>
  <!-- <div class="vue-img-paste-upload">
    <ul class="vipu-img-list">
      <li class="vipu-img-item" v-for="(file, index) in fileList" :key="index">
        <img :src="file.url" alt="" />
        <span class="vipu-hanlde-icon-box"  v-if="!readonly">
          <span class="iconBox" @click="handleViewFile(file)" v-if="zoom">
            <i class="vipufont vipu-icon-fangda"></i>
          </span>
          <span class="iconBox" @click="handleDelete(file, index)">
            <i class="vipufont vipu-icon-del"></i>
          </span>
        </span>
      </li>
    </ul>
    <div class="vipu-btn-box" @click="$refs.vipuInput.click()" v-if="!readonly && (fileList.length < max)">
      <input
        type="file"
        ref="vipuInput"
        class="vipu-input"
        :accept="accept"
        :multiple="multiple"
        @change="hanldeFileChange"
      />
      <i class="vipufont vipu-icon-add"></i>
    </div>
  </div> -->
  <input
    v-show="false"
    type="file"
    ref="input"
    :accept="accept"
    @change="hanldeFileChange"
  />
</template>

<script>
export default {
  name: "vue-img-paste-upload",
  props: {
    accept: {
      type: String,
      default: ".gif, .jpg, .jpeg, .png",
    },
    onUpload: {
      type: Function,
    },
  },
  data() {
    return {};
  },
  methods: {
    actived() {
      this.$refs.input.click();
    },
    getFileUrl(file) {
      //获取文件地址
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    hanldeFileChange(event) {
      //input file change
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        file.type.indexOf("image") !== -1 && this.handleUpload(file);
      });
    },
    handleUpload(blob) {
      if (this.onUpload && typeof this.onUpload === "function") {
        const fileUrl=this.getFileUrl(blob);
        const cb = this.onUpload(blob,fileUrl);
      }
      this.$refs.input.value = null;
    },
  },
};
</script>

<style lang="scss"></style>
