<template>
  <div
    ref="item"
    class="container"
  >
    <div
      class="diary-event"
      :class="{'theme-border-color': !event.hasRead, 'theme-light-background-color': isSelected, 'theme-hover-light-background-color': isSelectionMode, 'theme-extra-light-background-color': (!isSelected && !isSelectionMode && event.hasRead)}"
      tabindex="0"
      :title="$t('selectToConsult')"
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

      <div
        v-if="!isSelectionMode && (event.isEditable || event.isDeletable)"
        class="event-options"
      >
        <button
          v-if="event.isEditable"
          class="option"
          :aria-label="$t('update')"
          :title="$t('update')"
          @click.stop="isUpdateModalDisplayed = true"
        >
          <img
            src="@/assets/icons/pencil.svg"
            alt="edit"
          >
        </button>
        <button
          v-if="event.isDeletable"
          class="option"
          :aria-label="$t('delete')"
          :title="$t('delete')"
          @click.stop="confirmDeleteEvent"
        >
          <img
            src="@/assets/icons/trash.svg"
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
</template>

<script>
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { deleteEvent, setEventRead } from '@/api/dashboard/agenda.service'
import { isInViewport } from '@/utils/commons.util'
const SaveDiaryEventModal = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/SaveDiaryEventModal.vue'))
const DiaryEventDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/DiaryEventDetailsModal.vue'))

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
  emits: ['deleteEvent', 'updateEvent', 'getNextEvents', 'select', 'markAsRead', 'refresh'],
  data () {
    return {
      isUpdateModalDisplayed: false,
      isDetailsModalDisplayed: false,
      refreshEventsOnClose: false
    }
  },
  computed: {
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
        text: this.$t('removalConfirmMessage', { target: this.event.title }),
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.container {
  padding-right: 4px;
  padding-top: 4px;
  height: 52px;
  width: 99%;
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

  &.theme-border-color {
    border: 2px solid;
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

    img {
      height: 1rem;
    }

    &:hover {
      background-color: $color-hover-bg;
    }
  }
}

</style>

<i18n locale="fr">
{
  "delete": "Supprimer",
  "update": "Modifier",
  "removalConfirmMessage": "Veuillez confirmer la suppression de l'évènement \"{target}\"",
  "selectToConsult": "Sélectionner pour consulter"
}
</i18n>
