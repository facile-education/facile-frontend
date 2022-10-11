<template>
  <div
    class="fields"
    data-test="fields"
    :class="mq.phone ? 'phone-fields' : ''"
  >
    <div
      class="selection-icon"
      tabindex="0"
      @keypress.enter="toggleGlobalSelection"
      @click="toggleGlobalSelection"
    >
      <div class="oval">
        <div
          v-if="areAllSelected"
          class="marked"
        />
      </div>
    </div>

    <div
      v-for="field in fieldsToDisplay"
      :key="field.position"
      class="field"
      :class="field.name"
      tabindex="0"
      @keypress.enter="dispatchEvent(field.sort.type)"
      @click="dispatchEvent(field.sort.type)"
    >
      <p> {{ field.label }} </p>
      <div
        v-if="field.sort.type !== 'lastModifiedDate' || currentSort.type === 'lastModifiedDate'"
        class="icon-container"
      >
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
    },
    areAllSelected: {
      type: Boolean,
      required: true
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
          if (this.mq.phone || this.mq.tablet) {
            if (this.fields[i].name === 'name') {
              fieldsToDisplay.push(this.fields[i])
            }
          } else {
            fieldsToDisplay.push(this.fields[i])
          }
        }
      }
      return fieldsToDisplay
    }
  },
  methods: {
    toggleGlobalSelection () {
      if (this.areAllSelected) {
        this.$store.dispatch('documents/cleanSelectedEntities')
      } else {
        this.$store.dispatch('documents/selectAll')
      }
    },
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
  margin-bottom: 7px;

  .selection-icon {
    cursor: pointer;
    width: 40px;
    min-width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 18px;

    .oval {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: 20px;
      width: 20px;
      border-radius: 10px;
      border: 1px solid black;
      background-color: white;

      .marked {
        height: 12px;
        width: 12px;
        border-radius: 6px;
        background-color: #0B3C5F;
      }
    }
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
  margin-right: auto;
}

.date {
  width: 150px;
  padding-right: 20px;
  justify-content: flex-end;
}

.phone-fields {
  margin-bottom: 15px;

  .selection-icon {
    justify-content: center;
  }

  p {
    margin: 3px 0;
  }

  .field{
    font-size: 1em;
  }
}

</style>
