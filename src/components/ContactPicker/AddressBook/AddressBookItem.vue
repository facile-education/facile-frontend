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
          v-if="icon && isIconImage"
          :src="icon"
          alt=""
        >
        <CustomIcon
          v-else-if="icon"
          class="font-icon"
          :icon-name="icon"
        />
        <span>
          {{ title }}
        </span>
      </span>
      <CustomIcon
        v-if="!isLeaf"
        :class="isExtended ? 'extend': 'collapse'"
        icon-name="icon-chevron-right-s"
      />
      <button
        v-else-if="isASelectableLeaf"
        class="toggle-selection-button"
        @click.stop="toggleList"
      >
        <img
          v-if="!isSelected"
          src="@/assets/icons/add.svg"
          :alt="$t('ContactPicker.AddressBookItem.add')"
          :title="$t('ContactPicker.AddressBookItem.add')"
        >
        <img
          v-else
          src="@/assets/icons/remove.svg"
          :alt="$t('ContactPicker.AddressBookItem.remove')"
          :title="$t('ContactPicker.AddressBookItem.remove')"
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
import CustomIcon from '@components/Base/CustomIcon.vue'

export default {
  name: 'AddressBookItem',
  components: { CustomIcon },
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
    },
    isASelectableLeaf: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select', 'add', 'remove'],
  data () {
    return {
      isExtended: false,
      timeout: 0,
      clickDelayPassed: true
    }
  },
  computed: {
    isIconImage () {
      return this.icon?.indexOf('svg') !== -1
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
      if (this.clickDelayPassed) {
        if (this.isSelected) {
          this.$emit('remove')
        } else {
          this.$emit('add')
        }
      }
      // Code to prevent double clicks to trigger two times the selection
      this.clickDelayPassed = false
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.clickDelayPassed = true
      }, 300)
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

    .font-icon {
      margin-right: 0.3em;
      font-size: 1.6rem;
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

  .icon-chevron-right-s {
    font-size: 1.2rem;
    line-height: 1.2rem;
  }
}

.collapse, .extend {
  transition:  transform .6s;
}

.extend {
  transform: rotate(-90deg);
}

.collapse {
  transform: rotate(90deg);
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
