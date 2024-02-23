<template>
  <div class="wrapper">
    <WeprodeButton
      v-if="isNew"
      :class="{'phone': mq.phone}"
      class="create-button"
      @click="handleClick"
    >
      <CustomIcon icon-name="icon-plus" />
      <span>{{ $t('Documents.OptionItem.new') }}</span>
    </WeprodeButton>
    <button
      v-else
      ref="root"
      class="option-item"
      :title="option.title"
      @click="handleClick"
    >
      <img
        v-if="isIconImage"
        :src="option.icon"
        alt=""
      >
      <CustomIcon
        v-else
        class="icon"
        :icon-name="option.icon"
      />
      <span class="title">
        {{ option.title }}
      </span>
    </button>
    <ContextMenu
      v-if="isContextMenuDisplayed && isAContextMenuDisplayed"
      :is-absolute="true"
      @choose-option="subMenuOptionClicked"
      @close="isContextMenuDisplayed=false"
    />
  </div>
</template>

<script>

import CustomIcon from '@components/Base/CustomIcon.vue'
import ContextMenu from '@components/ContextMenu/ContextMenu'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
export default {
  name: 'OptionItem',
  components: { CustomIcon, ContextMenu, WeprodeButton },
  inject: ['mq'],
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  emits: ['optionClicked', 'addSize'],
  data () {
    return {
      isContextMenuDisplayed: false
    }
  },
  computed: {
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    },
    isNew () {
      return this.option.name === 'new'
    },
    isIconImage () {
      return this.option.icon?.indexOf('svg') !== -1
    }
  },
  mounted () {
    if (this.isNew) {
      this.$emit('addSize', 150)
    } else {
      this.$emit('addSize', this.$refs.root.clientWidth)
    }
  },
  methods: {
    handleClick (event) {
      if (this.option.subMenu) {
        this.openSubMenu(event)
      } else {
        this.$emit('optionClicked', this.option)
      }
    },
    subMenuOptionClicked (option) {
      this.isContextMenuDisplayed = false
      this.$store.dispatch('contextMenu/closeMenus')
      this.$emit('optionClicked', option)
    },
    openSubMenu (event) {
      if (!this.isAContextMenuDisplayed) {
        this.isContextMenuDisplayed = true
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event,
            options: this.option.subMenu
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.wrapper {
  position: relative;
  min-width: 70px;
}

.option-item {
  display: flex;
  cursor: pointer;
  align-items: center;
  border-radius: 6px;
  padding: 0 5px;
  height: 100%;
  margin: 0 10px;
  background: none;
  border: none;

  &:hover {
    background-color: $color-hover-bg;
  }
}

img {
  width: 28px;
  height: 28px;
  padding: 5px;
}

.icon {
  font-size: 20px;
  padding: 5px;
}

.title {
  font-size: 0.875em;
}

.arrow-down {
  width: 15px;
  height: 15px;
  padding: 0;
  margin-left: 10px;
}

.create-button {
  @extend %create-button;
}
</style>
