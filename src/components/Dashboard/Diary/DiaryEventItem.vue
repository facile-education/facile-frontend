<template>
  <div class="container">
    <div
      class="diary-event"
      :class="{'theme-border-color': !event.hasRead}"
      tabindex="0"
      @click="showDetails"
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
          <span>{{ event.location }}</span>
          <span>{{ ' - ' + eventHour }}</span>
        </div>
        <strong class="title">
          {{ event.title }}
        </strong>
      </div>

      <div
        v-if="event.isEditable"
        class="event-options"
      >
        <button
          class="option"
          @click="isUpdateModalDisplayed = true"
        >
          <img
            src="@/assets/icon_edit_texte.svg"
            alt="edit"
          >
        </button>
        <button
          class="option"
          @click="confirmDeleteEvent"
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
</template>

<script>
import dayjs from 'dayjs'
import { deleteEvent } from '@/api/dashboard/agenda.service'
import SaveDiaryEventModal from '@components/Dashboard/Diary/SaveDiaryEventModal.vue'

export default {
  name: 'DiaryEventItem',
  components: { SaveDiaryEventModal },
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  emits: ['deleteEvent', 'updateEvent'],
  data () {
    return {
      isUpdateModalDisplayed: false
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
  methods: {
    showDetails () {
      // TODO
      console.log('TODO: Show event details')
    },
    updateEvent () {
      this.$emit('updateEvent')
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
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-right: 4px;
  padding-top: 4px;
  height: 50px;
}

.diary-event {
  position: relative;
  height: 100%;
  border-radius: 5px;
  background-color: #F4F8FF;
  display: flex;
  padding: 4px;
  --date-width: 41px;
  font-size: 14px;
  line-height: 18px;

  &.theme-border-color {
    border: 1px solid;
  }

  .pellet {
    --pellet_size: 16px;
    height: var(--pellet_size);
    width: var(--pellet_size);
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 100%;
    transform: translate(-75%, -25%);
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

  .option {
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #01d801;
    }
  }
}

</style>

<i18n locale="fr">
{
  "removalConfirmMessage": "L'événement sera définitivement perdu"
}
</i18n>
