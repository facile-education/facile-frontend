<template>
  <div
    ref="item"
    class="container"
  >
    <div
      v-if="!event.hasRead"
      class="pellet theme-background-color"
    />

    <div
      class="diary-event"
      :class="{'theme-border-color': !event.hasRead, 'theme-light-background-color': isSelected, 'theme-hover-light-background-color': isSelectionMode, 'theme-extra-light-background-color': (!isSelected && !isSelectionMode && event.hasRead)}"
      tabindex="0"
      :title="$t('Dashboard.DiaryEventItem.selectToConsult')"
      @keyup.enter="handleClick"
      @click="handleClick"
    >
      <div class="date theme-text-color">
        <div class="day-label">
          {{ eventDay }}
        </div>
        <b class="day-number-label">
          {{ eventDayNumber }}
        </b>
      </div>

      <div class="content">
        <div class="meta-data">
          <span v-if="event.location">{{ event.location + ' - ' }}</span>
          <span>{{ eventHour }}</span>
        </div>
        <strong class="title">
          {{ event.title }}
        </strong>
      </div>

      <button
        v-if="haveOptions && (mq.phone || mq.tablet)"
        class="options-button"
        :aria-label="$t('options')"
        :title="$t('options')"
        @click="toggleContextMenu"
      >
        <img
          height="16"
          width="16"
          :src="require('@assets/icons/dots.svg')"
          alt="options"
        >
      </button>

      <div
        v-else-if="haveOptions"
        class="event-options"
      >
        <button
          v-if="event.isEditable"
          class="option"
          :aria-label="$t('Dashboard.DiaryEventItem.update')"
          :title="$t('Dashboard.DiaryEventItem.update')"
          data-test="buttonEditEvent"
          @click.stop="isUpdateModalDisplayed = true"
          @keyup.stop
        >
          <CustomIcon
            class="icon"
            icon-name="icon-edit"
          />
        </button>
        <button
          v-if="event.isDeletable"
          class="option"
          :aria-label="$t('Dashboard.DiaryEventItem.delete')"
          :title="$t('Dashboard.DiaryEventItem.delete')"
          data-test="buttonDeleteEvent"
          @click.stop="confirmDeleteEvent"
          @keyup.stop
        >
          <CustomIcon
            class="icon"
            icon-name="icon-trash"
          />
        </button>
      </div>
    </div>
  </div>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveDiaryEventModal
      :init-event="event"
      @update-event="updateEvent"
      @close="isUpdateModalDisplayed = false"
    />
  </teleport>

  <teleport
    v-if="isDetailsModalDisplayed"
    to="body"
  >
    <DiaryEventDetailsModal
      :init-event="event"
      @update="updateEvent"
      @delete="updateEvent"
      @close="closeDetailsModal"
    />
  </teleport>

  <teleport
    v-if="displayMenu"
    to="body"
  >
    <ContextMenu
      @choose-option="performChosenOption"
      @close="displayMenu=false"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { deleteEvent, setEventRead } from '@/api/dashboard/agenda.service'
import { icons } from '@/constants/icons'
import { isInViewport } from '@/utils/commons.util'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu.vue'))
const SaveDiaryEventModal = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/SaveDiaryEventModal.vue'))
const DiaryEventDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/DiaryEventDetailsModal.vue'))

export default {
  name: 'DiaryEventItem',
  components: { CustomIcon, ContextMenu, DiaryEventDetailsModal, SaveDiaryEventModal },
  inject: ['mq'],
  props: {
    event: {
      type: Object,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    },
    isSelectionMode: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['deleteEvent', 'updateEvent', 'getNextEvents', 'select', 'markAsRead', 'refresh'],
  data () {
    return {
      isUpdateModalDisplayed: false,
      isDetailsModalDisplayed: false,
      refreshEventsOnClose: false,
      displayMenu: false
    }
  },
  computed: {
    haveOptions () {
      return !this.isSelectionMode && (this.event.isEditable || this.event.isDeletable)
    },
    eventDay () {
      const string = dayjs(this.event.startDate).format('ddd')
      return string.substring(0, string.length - 1) // To remove the last '.' with 'ddd' formatting
    },
    eventDayNumber () {
      return dayjs(this.event.startDate).format('DD')
    },
    eventHour () {
      return dayjs(this.event.startDate).format('HH:mm')
    }
  },
  watch: { // Must be watched to react on a new search
    isLast: {
      handler () {
        if (this.isLast) {
          if (isInViewport(this.$refs.item)) {
            this.$emit('getNextEvents')
          }
        }
      }
    },
    isSelected: {
      immediate: true,
      handler () {
        if (this.isSelected) {
          if (!this.event.hasRead) {
            this.markEventAsRead()
          }
        }
      }
    }
  },
  mounted () {
    if (this.isLast) {
      if (isInViewport(this.$refs.item)) {
        this.$emit('getNextEvents')
      }
    }
  },
  methods: {
    handleClick () {
      if (this.isSelectionMode) {
        this.$emit('select')
      } else {
        if (!this.event.hasRead) {
          this.refreshEventsOnClose = true
          this.markEventAsRead()
        }
        this.isDetailsModalDisplayed = true
      }
    },
    updateEvent () {
      this.$emit('updateEvent')
    },
    markEventAsRead () {
      setEventRead(this.event.eventId, true).then((data) => {
        if (data.success) {
          this.$emit('markAsRead')
        } else {
          console.error('Error')
        }
      })
    },
    closeDetailsModal () {
      this.isDetailsModalDisplayed = false
      if (this.refreshEventsOnClose) {
        this.$emit('refresh')
      }
      this.refreshEventsOnClose = false
    },
    confirmDeleteEvent () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Dashboard.DiaryEventItem.removalConfirmMessage', { target: this.event.title }),
        lastAction: { fct: this.deleteEvent, params: [] }
      })
    },
    toggleContextMenu (event) {
      this.displayMenu = true
      const options = []
      if (this.event.isEditable) {
        options.push({
          name: 'update',
          i18nKey: 'Dashboard.DiaryEventItem.update',
          icon: icons.options.rename,
          position: 1,
          hasSeparator: false
        })
      }
      if (this.event.isDeletable) {
        options.push({
          name: 'delete',
          i18nKey: 'Dashboard.DiaryEventItem.delete',
          icon: icons.options.delete,
          position: 2,
          hasSeparator: false
        })
      }
      this.$store.dispatch('contextMenu/openContextMenu', { event, options })
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'update':
          this.isUpdateModalDisplayed = true
          break
        case 'delete':
          this.confirmDeleteEvent()
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.displayMenu = false
      this.$store.dispatch('contextMenu/closeMenus')
    },
    deleteEvent () {
      deleteEvent(this.event.eventId).then((data) => {
        if (data.success) {
          this.$emit('deleteEvent')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.container {
  position: relative;
  padding-right: 4px;
  padding-top: 4px;
  height: 52px;
  width: 99%;

  .pellet {
    @extend %item-pellet;
    transform: translate(-88%, -15%);
    z-index: 1;
  }
}

.diary-event {
  position: relative;
  cursor: pointer;
  height: 100%;
  border-radius: 5px;
  display: flex;
  padding: 0 4px;
  --date-width: 41px;
  font-size: 14px;
  line-height: 18px;
  overflow: hidden;

  &.theme-border-color {
    border: 2px solid;
  }

  &:hover, &:focus-within {
    .event-options {
      opacity: 100%;
      right: 8px;
      transform: translateX(0);
    }
  }
}

.options-button {
  padding: 0 10px;
  margin: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.date{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: var(--date-width);
  text-align: center;

  .day-label {
    font-size: 12px;
    text-transform: uppercase;
  }
}

.content {
  width: calc(100% - var(--date-width));
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 4px;

  .meta-data, .title {
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .title {
    @extend %font-medium-m;
  }

  .meta-data {
    @extend %font-regular-xs;
  }
}

.event-options {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  transform: translateX(100%);
  height: 100%;
  display: flex;
  gap: 4px;
  align-items: center;
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  transition: all .4s ease;

  .option {
    padding: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 1rem;
    transition: all .3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background-color: $neutral-20;

    .icon {
      font-size: 1rem;
      color: black;
    }

    &:hover {
      background-color: $color-hover-bg;
    }
  }
}

</style>
