<template>
  <div>
    <button
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
        class="icon"
        :class="isExtended ? 'extend': 'collapse'"
        name="chevron-up"
      />
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
    }
  },
  emits: ['select'],
  data () {
    return {
      isExtended: false
    }
  },
  methods: {
    handleClick () {
      this.isLeaf ? this.select() : this.toggleExtension()
    },
    toggleExtension () {
      this.isExtended = !this.isExtended
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
  display: flex;
  height: 30px;
  padding: 0 0.5em;
  width: 100%;
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  border: none;
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
