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
        class="progression-title"
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
      <img
        class="close-button"
        src="@assets/big-cross-black.svg"
        :alt="$t('close')"
        :title="$t('close')"
        @click="closeCalendarPicker()"
      >
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
            @click="addSession(arg.event)"
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
import dayjs from 'dayjs'
import FullCalendar from '@fullcalendar/vue3'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import { addAssignment } from '@/api/progression.service'

// Lazy loading
import { defineAsyncComponent } from 'vue'
const Timeline = defineAsyncComponent(() => import('@/components/Horaires/Timeline'))
const CalendarEvent = defineAsyncComponent(() => import('@/components/Progression/Assignment/CalendarEvent'))

export default {
  name: 'CalendarPicker',
  components: { FullCalendar, Timeline, CalendarEvent },
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
      return (this.$store.state.cdt.configuration.schoolDays.length > 0) ? this.$store.state.cdt.configuration : undefined
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
      return this.$store.state.progression.affectedItem
    }
  },
  created () {
    console.log('picker', this)
    if (this.configuration === undefined) {
      this.$store.dispatch('cdt/getConfiguration')
      if (this.mq.phone) {
        this.onSelectDate(new Date())
      }
    }
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
      for (const sessionId in this.$store.state.progression.selectedSessionIds) {
        addAssignment(this.$store.state.progression.affectedItem.itemId, sessionId, 0).then(
          (data) => {
            if (data.success) {
              console.log('ok')
            }
          },
          (err) => {
            // TODO toastr
            console.error(err)
          }
        )
      }
    },
    formatCalendarSlot (slot) {
      const json = {
        extendedProps: {
          id: (slot.sessionId === undefined ? slot.schoollifeSessionId : slot.sessionId),
          subject: slot.subject,
          teachers: '',
          room: slot.room,
          cy: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('MM-DD_HH:mm')
        },
        title: slot.title,
        start: dayjs(slot.startDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
        end: dayjs(slot.endDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm'),
        backgroundColor: slot.color,
        borderColor: slot.color
      }
      return json
    },
    addSession (event) {
      console.log('addEvent ', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-picker {
  .header {
    display: flex;
    justify-content: space-between;
    .progression-title {
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
    height: 500px;
    max-height: 500px;
    scroll-behavior: auto;
  }
  .footer {
    display: flex;
    justify-content: space-around;
    width: 500px;
    margin: auto;
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
