<template>
  <div
    class="file"
    :class="{'selected': isSelected, 'dark': dark}"
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
  props: {
    file: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  emits: ['fileClicked'],
  computed: {
    icon () {
      if (icons.extensions[this.file.extension] === undefined) {
        return icons.file
      } else {
        return icons.extensions[this.file.extension]
      }
    },
    fileIconIsImage () {
      return this.icon.includes('.') || this.icon.includes(':') // if icon contains extension (like folder.svg) it's not a font-awesome
    },
    iconPrefix () {
      return 'fas'
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
  margin: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 0 10px 15px;
  color: $color-dark-text;

  /* disable text selection on documents (not convenient when shift-select) */
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none; /* CSS3 (little to no support) */

  &.dark {
    background-color: $color-not-white-bg;
  }

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
