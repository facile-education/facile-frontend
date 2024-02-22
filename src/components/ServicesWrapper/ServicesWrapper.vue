<template>
  <section
    class="services-wrapper"
    @scroll="handleScroll"
  >
    <h1 :aria-label="title" />
    <div
      v-if="mq.phone && isTitleVisible"
      class="menu-entry-title-mobile"
      :class="[isEntryTitleVisible ? 'visible' : 'hidden', 'theme-background-color']"
    >
      <CustomIcon
        :class="icon"
      />
      <span>{{ title }}</span>
    </div>
    <div class="containerSlot">
      <slot />
    </div>
  </section>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const CustomIcon = defineAsyncComponent(() => import('@components/Base/CustomIcon.vue'))

export default {
  name: 'ServicesWrapper',
  components: {
    CustomIcon
  },
  inject: ['mq'],
  props: {
    isTitleVisible: Boolean,
    icon: String,
    title: String
  },
  data () {
    return {
      scrollPosition: 0,
      lastScroll: 0,
      isEntryTitleVisible: true
    }
  },
  methods: {
    handleScroll (event) {
      console.log('services wrapper:', event.target.scrollTop)
      this.scrollPosition = event.target.scrollTop
      if (this.scrollPosition < this.lastScroll) {
        this.isEntryTitleVisible = true
      } else {
        this.isEntryTitleVisible = false
      }
      this.lastScroll = event.target.scrollTop
    }
  }
}
</script>

<style lang="scss" scoped>

.services-wrapper{
    height: 100%;
    overflow: auto;
}

.containerSlot{
  height: calc(100% - 48px);
  padding: 10px;
}

.menu-entry-title-mobile{
  grid-area: title;
  position: sticky;
  top: 0;
  height: fit-content;
  z-index: 1;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  border-top: solid 1px;
  transition: all .3s ease;
  span{
    font-size: 1.2rem;
  }
  i{
    font-size: 1.5rem;
  }
  &.visible{
    top: 0;
  }
  &.hidden{
    top: -45px;
  }
}
</style>
