<template>
  <div class="wrapper">
    <PentilaButton
      v-if="isNew"
      :class="{'phone': mq.phone}"
      class="create-button"
      @click="handleClick"
    >
      <NeroIcon
        name="fa-plus"
      />
      <span>{{ $t('new') }}</span>
    </PentilaButton>
    <button
      v-else
      ref="root"
      class="option-item"
      :title="option.title"
      @click="handleClick"
    >
      <img
        :src="option.icon"
        alt=""
      >
      <div class="title">
        {{ option.title }}
      </div>
      <img
        v-if="option.subMenu"
        class="arrow-down"
        src="@assets/arrow-down.svg"
        alt=""
      >
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

import ContextMenu from '@components/ContextMenu/ContextMenu'

import NeroIcon from '@/components/Nero/NeroIcon'
export default {
  name: 'OptionItem',
  components: { NeroIcon, ContextMenu },
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
            event: event,
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

<i18n locale="fr">
  {
    "new": "NOUVEAU"
  }
</i18n>
