<template>
  <ul class="tabs">
    <li
      v-for="(tab, index) in tabList"
      :key="index"
      :class="{'active theme-border-color': tab.active, 'theme-hover-text-color': !tab.active, 'hoverable': !tab.disabled, 'disabled': tab.disabled}"
      class="base-tab"
      :tabindex="tab.disabled ? -1 : 0"
      @keyup.enter="selectTab(index)"
      @click="selectTab(index)"
    >
      <div class="title">
        <img
          v-if="tab.icon"
          :src="tab.icon"
          alt=""
        >
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
    </li>
  </ul>
  <slot />
</template>

<script>
export default {
  name: 'WeprodeTabList',
  props: {},
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/design/common';

.tabs {
  list-style: none;
  padding: 0;
  margin: 0;
}

.base-tab {
  display: inline-block;
  padding: 0 1rem 8px 1rem;
  vertical-align: bottom;
  height: 1.5rem;
  border-bottom: 1px solid #E0E0E0;
  margin-bottom: 10px;

  @extend %no-text-highlight;

  &:not(.disabled):hover {
    cursor: pointer;
  }

  &.active {
    padding: 0 1rem 6px 1rem;
    font-weight: bolder;
    border-bottom: 3px solid;
  }
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    height: 20px;
  }
}
</style>
