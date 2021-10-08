<template>
  <div
    v-if="!mq.phone"
    class="file-picker-breadcrumb"
  >
    <template
      v-for="(folder, index) in breadcrumb"
      :key="folder.id"
    >
      <FilePickerBreadCrumbItem
        :folder="folder"
        :is-first-element="index === 0"
        :is-current-folder="index === breadcrumb.length-1"
        @itemClicked="itemClicked(folder.id)"
      />
      <img
        v-show="index < (breadcrumb.length - 1)"
        class="chevron"
        src="@assets/icon_big_arrow.svg"
        alt=""
      >
    </template>
  </div>
  <div
    v-else-if="breadcrumb.length > 0"
    class="phone-file-picker-breadcrumb"
  >
    <div
      v-if="breadcrumb.length > 1"
      class="back-option"
      @click="itemClicked(breadcrumb[breadcrumb.length - 2].id)"
    >
      <img
        src="@assets/icon_arrow_left.svg"
        class="image"
        alt="go back"
      >
      {{ breadcrumb[breadcrumb.length - 2].name }}
    </div>
    <div
      class="current-folder"
      :class="{'root' : breadcrumb.length === 1 }"
    >
      {{ breadcrumb[breadcrumb.length - 1].name }}
    </div>
  </div>
</template>

<script>
import FilePickerBreadCrumbItem from '@components/FilePicker/FilePickerBreadCrumbItem'
export default {
  name: 'FilePickerBreadCrumb',
  components: { FilePickerBreadCrumbItem },
  inject: ['mq'],
  props: {
    breadcrumb: {
      type: Array,
      required: true
    }
  },
  emits: ['itemClicked'],
  methods: {
    itemClicked (folderId) {
      this.$emit('itemClicked', folderId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.file-picker-breadcrumb {
  height: 50px;
  margin: 10px 0;
  display: flex;
  align-items: center;

  /* disable text selection on documents (not convenient when shift-select) */
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none; /* CSS3 (little to no support) */
}

.chevron {
  width: 11px;
  margin: 0 10px;
}

.phone-file-picker-breadcrumb {
  height: auto;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: $color-dark-text;

  .back-option {
    position: absolute;
    bottom: 0;
    left: 0;
    max-width: 25vw;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.75em;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 19px;

    img {
      margin-left: 15px;
      margin-right: 5px;
      height: 12px;
    }
  }

  .current-folder {
    max-width: 50vw;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 1.125em;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 24px;

    &.root {
      max-width: 100vw;
    }
  }
}

</style>
