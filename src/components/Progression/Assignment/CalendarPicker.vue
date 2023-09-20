<template>
  <div
    class="calendar-picker"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <!-- Header -->
    <div
      class="header"
    >
      <div
        class="item-title"
      >
        <img
          v-if="item.isHomework"
          class="item-type-icon"
          src="@assets/devoir.svg"
          :alt="$t('homework')"
          :title="$t('homework')"
        >
        <img
          v-else
          class="item-type-icon"
          src="@assets/seance.svg"
          :alt="$t('session')"
          :title="$t('session')"
        >
        <div
          class="labels"
        >
          <span
            class="label"
          >Affectation de</span>
          <span
            class="item-name"
          >{{ item.name }}</span>
        </div>
      </div>
      <div
        class="timeline"
      >
        <Timeline
          v-if="!mq.phone"
          :min-date="minDate"
          :max-date="maxDate"
          @selectWeek="onSelectWeek"
        />
      </div>
      <CustomIcon
        icon-name="icon-cross-L"
        class="icon"
        @click="closeCalendarPicker()"
      />
    </div>

    <!-- Calendar -->
    <div
      class="calendar"
    >
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
      >
        <template #eventContent="arg">
          <CalendarEvent
            :event="arg.event"
            :store="$store"
          />
        </template>
      </FullCalendar>
    </div>

    <div
      class="footer"
    >
      <PentilaButton
        :label="$t('cancel')"
        class="button cancel-button"
        cls="cancel"
        @click="closeCalendarPicker"
      />
      <PentilaButton
        :label="$t('add')"
        class="button create-button"
        @click="registerAssignments()"
      />
    </div>
  </div>
</template>

<script>
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import dayjs from 'dayjs'
// Lazy loading
import { defineAsyncComponent } from 'vue'
import CustomIcon from '@components/Base/CustomIcon.vue'
const Timeline = defineAsyncComponent(() => import('@/components/Horaires/Timeline'))
const CalendarEvent = defineAsyncComponent(() => import('@/components/Progression/Assignment/CalendarEvent'))

export default {
  name: 'CalendarPicker',
  components: { CustomIcon, FullCalendar, Timeline, CalendarEvent },
  inject: ['mq'],
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    calendarOptions () {
      return {
        locale: frLocale,
        plugins: [timeGridPlugin],
        initialView: this.mq.phone ? 'timeGridDay' : 'timeGridWeek',
        // 125 is toolbar (50) + margin (10) + timeline (65)
        height: this.mq.phone ? '100%' : 'max(800px, calc(100% - 125px))',
        expandRows: true,
        headerToolbar: {
          left: '',
          center: '',
          right: ''
        },
        eventTextColor: '#333',
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit'
          // omitZeroMinute: true
        },
        eventClick: this.onEventClick,
        views: {
          day: {
            dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric' }
          },
          timeGrid: {
            allDaySlot: false,
            hiddenDays: this.hiddenDays,
            nowIndicator: true,
            slotDuration: '01:00:00',
            slotMinTime: this.configuration.startDayTime,
            slotMaxTime: this.configuration.endDayTime
          }
        },
        events:
          this.eventList.map(slot => this.formatCalendarSlot(slot))
      }
    },
    configuration () {
      return (this.$store.state.calendar.configuration.schoolDays.length > 0) ? this.$store.state.calendar.configuration : undefined
    },
    eventList () {
      return this.$store.state.progression.sessionList
    },
    hiddenDays () {
      const hiddenDays = []
      let dayNumber
      for (dayNumber = 0; dayNumber <= 6; ++dayNumber) {
        if (this.configuration.schoolDays.indexOf(dayNumber) === -1) {
          hiddenDays.push(dayNumber)
        }
      }
      return hiddenDays
    },
    isLoading () {
      return this.$store.state.progression.isLoading || !this.configuration
    },
    minDate () {
      return dayjs(this.configuration.startDateSchool, 'YYYY-MM-DD HH:mm')
    },
    maxDate () {
      return dayjs(this.configuration.endDateSchool, 'YYYY-MM-DD HH:mm')
    },
    item () {
      return this.$store.state.progression.assignedItem
    }
  },
  created () {
    if (this.configuration === undefined) {
      this.$store.dispatch('calendar/getConfiguration')
      if (this.mq.phone) {
        this.onSelectDate(new Date())
      }
    }
    // Reset the added and removed affected session ids lists
    this.$store.dispatch('progression/resetAffectedSessions')
  },
  methods: {
    closeCalendarPicker () {
      this.$store.dispatch('progression/setCalendarPickerMode', false)
    },
    onEventClick (info) {
      // Handle event selection display
      if (this.selectedEvent) {
        const sameEvent = (this.selectedEvent.el === info.el)
        this.unselectEvent()
        if (sameEvent) {
          return
        }
      }

      info.el.parentNode.classList.add('selected')
      this.selectedEvent = info
    },
    onSelectDate (date) {
      this.selectedDate = dayjs(date).startOf('day')

      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(date)
      }

      this.$store.dispatch('progression/selectDates',
        { start: dayjs(date).subtract(1, 'day'), end: dayjs(date).add(2, 'day') })
    },
    onSelectWeek (week) {
      this.selectedDate = dayjs(week.firstDayOfWeek).startOf('day')

      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(new Date(week.firstDayOfWeek))
      }
      this.$store.dispatch('progression/selectDates',
        { start: dayjs(week.firstDayOfWeek, 'YYYY-MM-DD'), end: dayjs(week.lastDayOfWeek, 'YYYY-MM-DD') })
    },
    onSwipe (event) {
      if (this.mq.phone) {
        switch (event.type) {
          case 'swipeleft':
            // this.pan -= 320
            if (event.isFinal) this.nextDate()
            break
          case 'swiperight':
            // this.pan += 320
            if (event.isFinal) this.previousDate()
            break
        }
      }
    },
    nextDate () {
      this.selectedDate = this.selectedDate.add(1, 'day')
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.nextDate()
      } else {
        this.onSelectDate(this.selectedDate.toDate())
      }
    },
    previousDate () {
      this.selectedDate = this.selectedDate.subtract(1, 'day')
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.previousDate()
      } else {
        this.onSelectDate(this.selectedDate.startOf().toDate())
      }
    },
    unselectEvent () {
      if (this.selectedEvent.el.parentNode != null) {
        this.selectedEvent.el.parentNode.classList.remove('selected')
      }
      this.selectedEvent = undefined
    },
    registerAssignments () {
      this.closeCalendarPicker()
      if (this.$store.state.progression.assignedItem.isHomework) {
        // Case of homework : open homework assignment page
        this.$store.dispatch('progression/setHomeworkAssignmentMode', true)
      } else {
        // Case of session -> register
        for (let idx = 0; idx < this.$store.state.progression.addedAssignedSessions.length; ++idx) {
          const session = this.$store.state.progression.addedAssignedSessions[idx]
          this.$store.dispatch('progression/addSessionAssignment', { itemId: this.$store.state.progression.assignedItem.itemId, sessionId: session.sessionId })
        }
        for (let idx = 0; idx < this.$store.state.progression.removedAssignedSessions.length; ++idx) {
          const session = this.$store.state.progression.removedAssignedSessions[idx]
          this.$store.dispatch('progression/deleteAssignment', { itemId: this.$store.state.progression.assignedItem.itemId, sessionId: session.sessionId })
        }
        // Reset the added and removed affected session ids lists
        this.$store.dispatch('progression/resetAffectedSessions')
      }
    },
    formatCalendarSlot (slot) {
      const json = {
        extendedProps: {
          sessionId: slot.sessionId,
          subject: slot.subject,
          teachers: '',
          room: slot.room,
          assignedItemId: slot.assignedItemId,
          cy: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('MM-DD_HH:mm')
        },
        title: slot.title,
        start: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
        end: dayjs(slot.endDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
        backgroundColor: slot.color,
        borderColor: slot.color
      }
      return json
    }
  }
}
</script>

<style lang="scss">
@import 'src/design/fullcalendar';
</style>

<style lang="scss" scoped>
@import "@design";

.calendar-picker {
  height: calc(100vh - #{$switch-mode-banner-height});
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    .item-title {
      width: 20%;
      margin: auto;
      display: flex;
      flex-basis: content;
      .item-type-icon {
        width: 35px;
        height: 35px;
        margin: auto;
      }
      .labels {
        margin: auto;
        display: flex;
        flex-direction: column;
        .label {
          font-size: 12px;
        }
        .item-name {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .timeline {
      width: 50%;
      margin: auto;
    }
    .close-button {
      margin: auto;
      width: 20px;
      height: 20px;
    }
  }
  .calendar {
    flex: 1;
    overflow-y: scroll;
  }

  .footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 110px;
    z-index: 10;
    .button {
      width: 200px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "add": "Affecter à ces horaires",
  "cancel": "Annuler",
  "close": "Fermer",
  "homework": "Devoir",
  "session": "Séance"
}
</i18n>
