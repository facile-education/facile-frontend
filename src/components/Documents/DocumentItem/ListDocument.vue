<template>
  <div
    ref="document"
    class="list-document"
    :class="{'selected': isSelected, 'hovering': !mq.phone && !mq.tablet && hoverSelection, 'phone-list-document': mq.phone || mq.tablet, 'last': isLast}"
    tabindex="-1"
    @keypress.enter="triggerAction"
    @click.ctrl.exact="ctrlSelect"
    @click.meta.exact="ctrlSelect"
    @click.shift="shiftSelect"
    @dblclick="triggerAction"
    @click.exact="mq.phone || mq.tablet ? triggerAction() : select()"
    @mouseover="hoverSelection = true"
    @mouseleave="hoverSelection = false"
  >
    <div
      class="selection-icon"
      tabindex="0"
      @keypress.stop.prevent.enter="ctrlSelect"
      @click.shift.stop="shiftSelect"
      @click.exact.stop="ctrlSelect"
    >
      <div
        v-if="hoverSelection || isSelected || mq.phone || mq.tablet"
        class="oval"
      >
        <div
          v-if="isSelected"
          class="marked"
        />
      </div>
    </div>

    <div
      class="name"
      :class="{'select-mode': true}"
    >
      <div class="icon-container">
        <img
          v-if="fileIconIsImage"
          class="img-icon"
          :src="documentIcon"
          alt="document icon"
        >
        <BaseIcon
          v-else
          class="base-icon"
          :name="[iconPrefix, documentIcon]"
        />
      </div>
      <div class="name-container">
        <p
          class="name-label"
          :title="document.name"
          tabindex="0"
          @keypress.stop.enter="triggerAction"
          @click.stop="triggerAction"
        >
          {{ document.name }}
        </p>
        <div
          v-if="mq.phone || mq.tablet"
          class="phone-labels"
        >
          <p
            v-if="formattedSize !== '-'"
            class="size-label"
          >
            {{ formattedSize }}
          </p>
          <p
            v-if="isInCurrentsFields('date')"
            class="date-label"
          >
            {{ formattedDate }}
          </p>
        </div>
      </div>
    </div>

    <div class="right-section">
      <div
        v-if="displayQuickOptions"
        class="quick-options"
      >
        <div
          v-if="quickOptionsDisplayed"
          class="options"
        >
          <BaseIcon
            v-for="option in quickOptions"
            :key="option"
            class="option"
            :name="option.name"
            @click.stop="quickOptionClick(option)"
          />
        </div>
      </div>
      <div
        v-if="displayQuickOptions"
        class="separator"
      />
      <div
        v-if="isInCurrentsFields('size') && !(mq.phone || mq.tablet)"
        class="size"
      >
        <p>
          {{ formattedSize }}
        </p>
      </div>
      <div
        v-if="isInCurrentsFields('date') && !(mq.phone || mq.tablet)"
        class="date"
      >
        <p>
          {{ formattedDate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import dayjs from 'dayjs'
import { formatSize } from '@utils/commons.util'
import BaseIcon from '@components/Base/BaseIcon'

export default {
  name: 'ListDocument',
  components: { BaseIcon },
  inject: ['mq'],
  props: {
    document: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    documentIcon: {
      type: String,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    },
    quickOptions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  emits: ['chooseOption', 'triggerAction', 'select', 'ctrlSelect', 'shiftSelect'],
  data () {
    return {
      displayQuickOptions: false,
      quickOptionsDisplayed: false,
      hoverSelection: false
    }
  },
  computed: {
    fileIconIsImage () {
      // TODO: find a better way to separate img and font-awesome icons
      return this.documentIcon.includes('.') || this.documentIcon.includes(':') // if icon contains extension (like folder.svg) it's not a font-awesome
    },
    isModalOpen () {
      return this.$store.state.misc.nbOpenModals > 0
    },
    selectedEntities () {
      return this.$store.state.documents.selectedEntities
    },
    isSelected () {
      return this.selectedEntities.indexOf(this.document) !== -1
    },
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
    },
    formattedDate () {
      return this.document.lastModifiedDate !== undefined ? dayjs(this.document.lastModifiedDate, 'YYYY-MM-DD HH:mm:ss').calendar() : '-'
    },
    formattedSize () {
      return this.document.size !== undefined ? formatSize(this.document.size) : '-'
    },
    iconPrefix () {
      return 'fas'
    }
  },
  watch: {
    isSelected (newValue, oldValue) {
      if (newValue && !oldValue) {
        this.$refs.document.focus()
      }
      // TODO: Scroll element into view for the up and down arrow navigation case
      /* if (this.selectedEntities.length === 1 && this.isSelected) {
        this.$el.scrollIntoView({ behavior: 'smooth', block: 'end' })
      } */
    }
  },
  methods: {
    triggerAction () {
      if (!this.isModalOpen) {
        this.$emit('triggerAction')
      }
    },
    select () {
      this.$emit('select')
    },
    ctrlSelect () {
      this.$emit('ctrlSelect')
    },
    shiftSelect () {
      this.$emit('shiftSelect')
    },
    toggleQuickOptions () {
      this.quickOptionsDisplayed = !this.quickOptionsDisplayed
    },
    quickOptionClick (option) {
      this.toggleQuickOptions()
      this.$emit('chooseOption', option)
    },
    isInCurrentsFields (name) {
      return this.fieldsToDisplay.find(field => field.name === name) !== undefined
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.list-document {
  display: flex;
  align-items: center;
  padding-right: 20px;
  height: 40px;
  border-top: 1px solid $color-document-border;

  .selection-icon {
    cursor: pointer;
    width: 40px;
    min-width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

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

  .name {
    display: flex;
    min-width: 0;
    align-items: center;

    .icon-container {
      min-width: 60px;
      display: flex;
      justify-content: center;

      .img-icon {
        width: 25px;
        height: 25px;
      }

      .base-icon {
        font-size: 23px;
        color: #777777;
      }
    }

    .name-container {
      height: 100%;
      width: calc(100% - 40px);

      .name-label {
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 0.85em;
        letter-spacing: 0;
        margin: 2px 0 0 0;

        &:hover {
          text-decoration: underline;
        }
      }

      .phone-labels {
        font-size: 0.6875em;
        display: flex;
        align-items: center;

        .size-label, .date-label{
          letter-spacing: 0;
          line-height: 0.650em;
          margin-right: 10px;
        }
      }
    }
  }

  .right-section {
    margin-left: auto;
    display: flex;
    align-items: center;

    .quick-options {
      position: relative;

      .img-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 33px;
        height: 33px;
        border-radius: 17px;
        cursor: pointer;

        img {
          width: 15px;
        }

        &:hover {
          background-color: $color-hover-bg;
        }
      }

      .options {
        position: absolute;
        right: 0;
      }
    }

    .separator {
      height: 13px;
      width: 1px;
      border-right: 1px solid $color-document-border;
      margin: 0 20px;
    }

    .size {
      min-width: 20px;
      display: flex;
      justify-content: center;
      white-space: nowrap;
    }

    .date, .size{
      font-size: 0.75em;
      letter-spacing: 0;
      line-height: 16px;

      p {
        text-align: end;
      }
    }

    .date {
      width: 150px;
    }
  }

  &.selected {
    .name {
      .name-label{
        font-weight: 500;
      }
    }
  }
}

.phone-list-document {
  height: 51px;

  .selection-icon {
    justify-content: center;
  }

  .name {
    .icon-container {
      width: 30px;
      min-width: 30px;
      margin-right: 10px;
    }

    p{
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      font-size: 1em;
    }

    .size-label {
      margin: 0;
    }
  }

  .right-section {
    .date {
      width: 75px;
    }
  }
}

.last {
  border-bottom: 1px solid $color-document-border;;
}

.hovering {
  background-color : $color-hover-bg;
}

.selected {
  background-color : $color-selected-bg;
}

</style>
