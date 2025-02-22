<template>
  <button
    class="file"
    :class="{'selected': isSelected, 'dark': dark, 'grayed': grayed}"
    @click="fileClicked"
  >
    <span class="icon-container">
      <img
        v-if="fileIconIsImage"
        class="img-icon"
        :src="icon"
        alt="document icon"
      >
      <FAIcon
        v-else
        class="icon"
        :class="{'selected': isSelected}"
        :name="[iconPrefix, icon]"
      />
    </span>
    <span class="name">
      {{ file.name }}
    </span>
  </button>
</template>

<script>
import FAIcon from '@components/Base/FAIcon.vue'

import { icons } from '@/constants/icons'

export default {
  name: 'FilePickerFile',
  components: { FAIcon },
  props: {
    file: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    grayed: {
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
      return this.icon.includes('.') || this.icon.includes(':') // if icon contains extension (like icon.svg) it's not a font-awesome
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

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  margin: 0;
  padding: 0;
  border: none;
}

.file {
  width: 100%;
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

  &.grayed {
    color: gray;
    cursor: default;
  }

  &:hover:not(.grayed) {
    background-color: $color-hover-bg;
  }

  &.selected {
    background-color: $color-file-picker-selected-file !important;
    font-weight: 500;
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
        //color: $color-light-text;
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
