<template>
  <div
    class="folder"
    :class="{'selected': isSelected}"
    @click="folderClicked"
    @dblclick="folderDblClicked"
  >
    <div class="icon-container">
      <img
        class="icon"
        :src="$options.myIcons.folder"
        alt="document icon"
      >
    </div>
    <div class="name">
      {{ folder.name }}
    </div>
  </div>
</template>

<script>
import { icons } from '@/constants/icons'

export default {
  name: 'FilePickerFolder',
  myIcons: icons,
  props: {
    folder: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['folderClicked', 'folderDblClicked'],
  methods: {
    folderClicked () {
      this.$emit('folderClicked', this.folder)
    },
    folderDblClicked () {
      this.$emit('folderDblClicked', this.folder)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

  .folder {
    margin: 3px 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 15px;
    color: $color-dark-text;

    /* disable text selection on documents (not convenient when shift-select) */
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none; /* CSS3 (little to no support) */

    &:hover {
      background-color: $color-hover-bg;
    }

    &.selected {
      background-color: $color-file-picker-selected-file;
      color: $color-light-text;
    }

    .icon-container {
      width: 30px;
      margin-right: 5px;
      display: flex;
      justify-content: center;

      .icon {
        font-size: 23px;
        color: #777777;
      }
    }

    .name {
      max-width: calc(100% - 30px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

</style>
