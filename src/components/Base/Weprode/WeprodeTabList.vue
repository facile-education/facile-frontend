<template>
  <ul
    class="tabs"
    :style="'margin-bottom: ' + spaceUnderTab + ';'"
  >
    <li
      v-for="(tab, index) in tabList"
      :key="index"
      :class="{'active': tab.active, 'theme-hover-text-color': !tab.active, 'hoverable': !tab.disabled, 'disabled': tab.disabled}"
      class="base-tab"
      :tabindex="tab.disabled ? -1 : 0"
      @keyup.enter="selectTab(index)"
      @click="selectTab(index)"
    >
      <div class="title">
        <img
          v-if="tab.icon && isTabIconImage(tab)"
          :src="tab.icon"
          alt=""
        >
        <CustomIcon
          v-else-if="tab.icon"
          class="font-icon"
          :icon-name="tab.icon"
        />
        <span>
          {{ tab.title }}
        </span>
        <div
          v-if="tab.nbNotification > 0"
          class="tab-item-notification-pellet theme-background-color"
        >
          {{ tab.nbNotification }}
        </div>
      </div>
      <div
        v-if="tab.active"
        class="active-line theme-background-color"
      />
    </li>
  </ul>
  <slot />
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

export default {
  name: 'WeprodeTabList',
  components: { CustomIcon },
  props: {
    spaceUnderTab: {
      type: String,
      default: '1rem'
    }
  },
  data () {
    return {
      selectedIndex: 0,
      tabList: []
    }
  },
  computed: {
    activeComponent () {
      const component = this.tabList[this.activeIndex].component
      return () => import('@/components/' + component)
    }
  },
  mounted () {
    if (this.tabList.length > 0) {
      this.selectTab(0)
    }
  },
  methods: {
    selectTab (index) {
      if (!this.tabList[index].disabled) {
        this.tabList[this.selectedIndex].active = false
        this.tabList[index].active = true
        this.selectedIndex = index
      }
    },
    addTab (item) {
      this.tabList.push(item)
    },
    removeTab (item) {
      const index = this.tabList.indexOf(item)
      if (index > -1) {
        this.tabList.splice(index, 1)
      }
    },
    isTabIconImage (tab) {
      return tab.icon?.indexOf('svg') !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/design';

.tabs {
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid $neutral-40;
}

.base-tab {
  position: relative;
  display: inline-block;
  vertical-align: bottom;

  @extend %no-text-highlight;

  &:not(.disabled):hover {
    cursor: pointer;
  }

  &.active {
    font-weight: bolder;
  }

  .active-line {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
  }
}

.title {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 1.5rem;
  margin-bottom: 8px;

  img {
    height: 20px;
    margin-right: 0.5rem;
  }

  .font-icon {
    font-size: 1.5rem;
    margin-right: 0.3rem;
  }
}
</style>
