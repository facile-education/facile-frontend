<template>
  <div>
    <ul class="tabs">
      <li
        v-for="(tab, index) in tabList"
        :key="index"
        :class="{'active theme-text-color': tab.active}"
        class="tab theme-hover-text-color"
        @click="selectTab(index)"
      >
        <div>
          {{ tab.title }}
        </div>
      </li>
    </ul>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'NeroTabList',
  props: {},
  data () {
    return {
      selectedIndex: 0,
      tabList: []
    }
  },
  computed: {
    activeComponent () {
      var component = this.tabList[this.activeIndex].component
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
      this.tabList[this.selectedIndex].active = false
      this.tabList[index].active = true
      this.selectedIndex = index
    },
    addTab (item) {
      this.tabList.push(item)
    },
    removeTab (item) {
      var index = this.tabList.indexOf(item)
      if (index > -1) {
        this.tabList.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.tabs {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tab {
  display: inline-block;
  padding: 5px 10px;
  border-bottom: $border;
  @extend %no-text-highlight;

  &:hover {
    cursor: pointer;
  }

  &.active {
    font-weight: bolder;
    border-bottom: 2px solid;
    border-bottom-color: inherit;
  }
}
</style>
