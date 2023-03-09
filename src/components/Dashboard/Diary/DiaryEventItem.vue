<template>
  <div
    ref="item"
    class="container"
  >
    <div
      class="diary-event"
      :class="{'theme-border-color': !event.hasRead, 'theme-light-background-color': isSelected, 'theme-hover-light-background-color': isSelectionMode}"
      tabindex="0"
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

      <div
        class="content"
        :title="event.title"
      >
        <div class="meta-data">
          <span v-if="event.location">{{ event.location + ' - ' }}</span>
          <span>{{ eventHour }}</span>
        </div>
        <strong class="title">
          {{ event.title }}
        </strong>
      </div>

      <div
        v-if="!isSelectionMode && event.isEditable"
        class="event-options"
      >
        <button
          class="option"
          @click.stop="isUpdateModalDisplayed = true"
        >
          <img
            src="@/assets/icon_edit_texte.svg"
            alt="edit"
          >
        </button>
        <button
          class="option"
          @click.stop="confirmDeleteEvent"
        >
          <img
            src="@/assets/icon_trash.svg"
            alt="edit"
          >
        </button>
      </div>

      <div
        v-if="!event.hasRead"
        class="pellet theme-background-color"
      />
    </div>
  </div>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveDiaryEventModal
      :init-event="event"
      @updateEvent="updateEvent"
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
      @close="isDetailsModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import dayjs from 'dayjs'
import { deleteEvent, setEventRead } from '@/api/dashboard/agenda.service'
import { defineAsyncComponent } from 'vue'
const SaveDiaryEventModal = defineAsyncComponent(() => import('@/components/Dashboard/Diary/SaveDiaryEventModal.vue'))
const DiaryEventDetailsModal = defineAsyncComponent(() => import('@/components/Dashboard/Diary/DiaryEventDetailsModal.vue'))

export default {
  name: 'DiaryEventItem',
  components: { DiaryEventDetailsModal, SaveDiaryEventModal },
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
  emits: ['deleteEvent', 'updateEvent', 'getNextEvents', 'select', 'markAsRead'],
  data () {
    return {
      isUpdateModalDisplayed: false,
      isDetailsModalDisplayed: false
    }
  },
  computed: {
    eventDay () {
      return dayjs(this.event.startDate).format('dd')
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
          if (this.isInViewport(this.$refs.item)) {
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
      if (this.isInViewport(this.$refs.item)) {
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
    confirmDeleteEvent () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('removalConfirmMessage'),
        lastAction: { fct: this.deleteEvent, params: [] }
      })
    },
    deleteEvent () {
      deleteEvent(this.event.eventId).then((data) => {
        if (data.success) {
          this.$emit('deleteEvent')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    isInViewport (element) {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.container {
  padding-right: 4px;
  padding-top: 4px;
  height: 50px;
}

.diary-event {
  position: relative;
  cursor: pointer;
  height: 100%;
  border-radius: 5px;
  display: flex;
  padding: 4px;
  --date-width: 41px;
  font-size: 14px;
  line-height: 18px;

  &:not(.theme-light-background-color):not(.theme-hover-light-background-color) {
    background-color: #F4F8FF;
  }

  &.theme-border-color {
    border: 1px solid;
  }

  .pellet {
    @extend %item-pellet;
  }

  &:hover, &:focus-within {
    .event-options {
      opacity: 100%;

      .option {
        width: 40px;
      }
    }
  }
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

  .meta-data {
    font-size: 12px;
  }

  .meta-data, .title {
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
}

.event-options {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  transition: all .3s ease;
  opacity: 0;

  .option {
    width: 0;
    transition: all .3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: $color-hover-bg;
    }
  }
}

</style>

<i18n locale="fr">
{
  "removalConfirmMessage": "L'événement sera définitivement perdu"
}
</i18n>
