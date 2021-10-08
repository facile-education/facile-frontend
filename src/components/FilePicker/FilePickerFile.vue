<template>
  <div
    class="file"
    :class="{'selected': isSelected}"
    @click="fileClicked"
  >
    <div class="icon-container">
      <img
        v-if="fileIconIsImage"
        class="img-icon"
        :src="icon"
        alt="document icon"
      >
      <BaseIcon
        v-else
        class="icon"
        :class="{'selected': isSelected}"
        :name="[iconPrefix, icon]"
      />
    </div>
    <div class="name">
      {{ file.name }}
    </div>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'
import { icons } from '@/constants/icons'

export default {
  name: 'FilePickerFile',
  components: { BaseIcon },
  myIcons: icons,
  props: {
    file: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['fileClicked'],
  computed: {
    icon () {
      if (this.$options.myIcons.extensions[this.file.extension] === undefined) {
        return this.$options.myIcons.file
      } else {
        return this.$options.myIcons.extensions[this.file.extension]
      }
    },
    fileIconIsImage () {
      return this.icon.includes('.') || this.icon.includes(':') // if icon contains extension (like folder.svg) it's not a font-awesome
    },
    iconPrefix () {
      if (this.icon === 'code') {
        return 'fas'
      } else {
        return 'far'
      }
    }
  },
  methods: {
    fileClicked () {
      this.$emit('fileClicked', this.file)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.file {
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
      &.selected {
        color: $color-light-text;
      }
    }

    .img-icon{
      width: 25px;
      height: 25px;
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
