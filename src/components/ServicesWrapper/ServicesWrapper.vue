<template>
  <section
    class="services-wrapper"
    @scroll="handleScroll"
  >
    <h1 :aria-label="title" />
    <div
      v-if="mq.phone && isTitleVisible"
      class="services-title-mobile"
      :class="[isEntryTitleVisible ? 'visible' : 'hidden']"
    >
      <span>{{ title }}</span>
    </div>
    <div class="containerSlot">
      <slot />
    </div>
  </section>
</template>

<script>

export default {
  name: 'ServicesWrapper',
  inject: ['mq'],
  props: {
    isTitleVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
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
@import "@design";
.services-wrapper{
    height: 100%;
    overflow: auto;
}

.containerSlot{
  height: calc(100% - 48px);
  padding: 10px;
}

.services-title-mobile{
  grid-area: title;
  position: sticky;
  top: 0;
  height: fit-content;
  z-index: 5;
  width: 100%;
  padding: 16px 10px 6px 10px;
  transition: all .3s ease;
  background-color: white;
  span{
    font-size: 1.5rem;
    font-weight: 500;
  }
  &.visible{
    top: 0;
  }
  &.hidden{
    top: -45px;
  }
}
</style>
