<template>
  <div>
    <button
      class="title"
      :class="{'leaf': isLeaf, 'root': icon !== undefined, 'theme-text-color': isThemeColor, 'theme-border-color': isThemeColor}"
      :title="title"
      @click="handleClick"
    >
      <span class="left">
        <img
          v-if="icon"
          :src="icon"
          alt=""
        >
        <span>
          {{ title }}
        </span>
      </span>
      <BaseIcon
        v-if="!isLeaf"
        class="extend-icon"
        :class="isExtended ? 'extend': 'collapse'"
        name="chevron-up"
      />
      <button
        v-else
        class="toggle-selection-button"
        @click.stop="toggleList"
      >
        <img
          v-if="!isSelected"
          src="@assets/icons/add.svg"
          alt="remove"
        >
        <img
          v-else
          src="@assets/icons/remove.svg"
          alt="add"
        >
      </button>
    </button>
    <Transition name="slide-fade">
      <div
        v-if="isExtended"
        :class="isExtended ? 'extended' : 'collapsed'"
        class="sub-tree"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'

export default {
  name: 'AddressBookItem',
  components: { BaseIcon },
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: undefined
    },
    isLeaf: {
      type: Boolean,
      default: false
    },
    isThemeColor: {
      type: Boolean,
      default: false
    },
    beginExtended: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select', 'add', 'remove'],
  data () {
    return {
      isExtended: false
    }
  },
  mounted () {
    this.isExtended = this.beginExtended
  },
  methods: {
    handleClick () {
      this.isLeaf ? this.select() : this.toggleExtension()
    },
    toggleExtension () {
      this.isExtended = !this.isExtended
    },
    toggleList () {
      if (this.isSelected) {
        this.$emit('remove')
      } else {
        this.$emit('add')
      }
    },
    select () {
      this.$emit('select')
      this.$store.dispatch('contact/openMobileUserList')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  border: none;
}

.title {
  display: flex;
  height: 30px;
  padding: 0 0.4em;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  font-size: 1em;

  &.root {
    height: 45px;
  }

  &:not(.leaf):not(.theme-border-color) {
    border-bottom: 1px solid $color-border;
  }

  &.theme-border-color {
    border-bottom: 1px solid;
  }

  &:hover {
    background-color: $color-hover-bg;
  }

  .left {
    height: 100%;
    align-items: center;
    display: flex;
    overflow-x: hidden;

    img {
      margin-right: 0.5em;
    }

    span {
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .toggle-selection-button {
    padding-right: 0;

    img {
      width: 18px;
    }
  }

  .extend-icon {
    margin-right: 2px;
  }
}

.collapse, .extend {
  transition:  transform .6s;
}

.extend {
  transform: rotate(0);
}

.collapse {
  transform: rotate(180deg);
}

.sub-tree {
  padding-left: 10px;
  overflow-y: hidden;
}

.slide-fade-enter-active {
  transition: all .3s ease-in;
}
.slide-fade-leave-active {
  transition: all .3s ease-out;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  max-height: 0;
}
.slide-fade-enter-to, .slide-fade-leave-from {
  /* TODO: make max-height adaptive to content height */
  max-height: 200px;
}

</style>
