<template>
  <span
    class="breadcrumb-item"
    :class="{'first-element': isFirstElement, 'active': isActive}"
    @mouseover="setActive"
    @mouseleave="cancelActive"
    @click.stop="itemClicked"
  >
    {{ folder.name }}
  </span>
</template>

<script>
export default {
  name: 'FilePickerBreadCrumbItem',
  inject: ['mq'],
  props: {
    folder: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    isFirstElement: {
      type: Boolean,
      default: false
    },
    isCurrentFolder: {
      type: Boolean,
      default: false
    }
  },
  emits: ['itemClicked'],
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    setActive () {
      if (!this.isCurrentFolder) {
        this.isActive = true
      }
    },
    cancelActive () {
      this.isActive = false
    },
    itemClicked () {
      this.$emit('itemClicked', this.folder.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.breadcrumb-item{
  max-width: 200px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: 0.875em;
  color: $color-dark-text;
  font-weight: 600;
  letter-spacing: 0;
  border-radius: 6px;
  margin-right: 3px;
  padding: 3px;
  line-height: 21px;
}

.active {
  cursor: pointer;
  background-color: $color-hover-bg;
}

</style>
