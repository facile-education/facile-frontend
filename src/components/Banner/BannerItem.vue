<template>
  <div
    :title="tooltip"
    class="banner-item"
    @click="dispatchEvent"
  >
    <img
      v-if="src"
      :src="src"
    >
    <NeroIcon
      v-else
      :name="icon"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const NeroIcon = defineAsyncComponent(() => import('@components/Nero/NeroIcon'))

export default {
  name: 'BannerItem',
  components: { NeroIcon },
  props: {
    icon: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      default: ''
    },
    tooltip: {
      type: String,
      default: ''
    }
  },
  emits: ['click'],
  methods: {
    dispatchEvent () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.banner-item {
  margin: auto 5px;
  height: 30px;
  width: 30px;
  cursor: pointer;
  text-align: center;
  font-size: 1.4rem;
  line-height: 2rem;
}
</style>
