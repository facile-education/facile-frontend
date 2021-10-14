<template>
  <div
    class="fields"
    :class="mq.phone ? 'phone-fields' : ''"
  >
    <div
      v-for="field in fieldsToDisplay"
      :key="field.position"
      class="field"
      :class="field.name"
      @click="dispatchEvent(field.sort.type)"
    >
      <p> {{ field.label }} </p>
      <div class="icon-container">
        <BaseIcon
          v-if="currentSort.type === field.sort.type && currentSort.isOrderAsc"
          class="icon"
          name="chevron-up"
        />
        <BaseIcon
          v-if="currentSort.type === field.sort.type && !currentSort.isOrderAsc"
          class="icon"
          name="chevron-down"
        />
      </div>
    </div>
  </div>
</template>

<script>

import BaseIcon from '@components/Base/BaseIcon'

export default {
  name: 'FilesFields',
  components: { BaseIcon },
  inject: ['mq'],
  props: {
    currentSort: {
      type: Object,
      default: undefined
    }
  },
  emits: ['handleSort'],
  computed: {
    fields () {
      return this.$store.state.fileFields.fields
    },
    fieldsToDisplay () {
      const fieldsToDisplay = []
      for (let i = 0; i < this.fields.length; ++i) {
        if (this.fields[i].isSelected) {
          fieldsToDisplay.push(this.fields[i])
        }
      }
      return fieldsToDisplay
    }
  },
  created () {
    // Maybe only when it's on root folder
    this.$store.dispatch('fileFields/initFields')
  },
  methods: {
    dispatchEvent (sortType) {
      if (sortType !== 'none') {
        this.$emit('handleSort', sortType)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.fields{
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 7px;
}

.phone-fields {
  padding: 0 10px;

  p {
    margin: 3px 0;
  }

  .field{
    font-size: 1em;
  }
}

.field{
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.8125em;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 16px;

  .icon-container {
    width: 10px;
    margin-left: 10px;
    display: flex;
    align-items: baseline;
    justify-content: center;

    .icon {
      font-size: 12px;
      margin-top: 3px;
    }
  }
}

.name {
  justify-content: flex-start;
  padding-right: 10%;
}

.date {
  margin-left: auto;
  padding-left: 10%;
  justify-content: flex-end;
}

</style>
