<template>
  <Layout>
    <HorairesToolbar class="toolbar" />
    <template v-if="configuration">
      <DatepickerNav
        v-if="$device.phone"
        @selectDate="onSelectDate"
      />
      <Timeline
        v-else
        :min-date="minDate"
        :max-date="maxDate"
        @selectWeek="onSelectWeek"
      />
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
      />
    </template>
    <!-- else = spinner -->
  </Layout>
</template>

<script>
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import FullCalendar from '@fullcalendar/vue3'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import Layout from '@/router/layouts/EmptyLayout'
import HorairesToolbar from '@/components/Horaires/HorairesToolbar'
import Timeline from '@/components/Horaires/Timeline'
import DatepickerNav from '@/components/Horaires/DatepickerNav'

dayjs.extend(customParseFormat)

export default {
  name: 'Horaires',
  components: {
    DatepickerNav,
    FullCalendar,
    HorairesToolbar,
    Layout,
    Timeline
  },
  data () {
    return {
      selectedEvent: undefined
    }
  },
  computed: {
    calendarOptions () {
      return {
        locale: frLocale,
        plugins: [timeGridPlugin],
        initialView: this.$device.phone ? 'timeGridDay' : 'timeGridWeek',
        height: 'calc(100% - 50px)',
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
        eventDidMount: this.onEventMount,
        views: {
          timeGrid: {
            allDaySlot: false,
            hiddenDays: this.hiddenDays,
            nowIndicator: true,
            slotDuration: '01:00:00',
            slotMinTime: this.configuration.startDayTime,
            slotMaxTime: this.configuration.endDayTime,
            slotLabelDidMount: this.onSlotMount
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
      return this.$store.state.horaires.sessionList
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
    minDate () {
      return dayjs(this.configuration.startDateSchool, 'DD/MM/YYYY HH:mm')
    },
    maxDate () {
      return dayjs(this.configuration.endDateSchool, 'DD/MM/YYYY HH:mm')
    },
    isTeacherSelected () {
      return this.$store.state.horaires.selectedUser.teacherId > 0
    }
  },
  created () {
    this.$store.dispatch('cdt/getConfiguration')
  },
  methods: {
    formatCalendarSlot (slot) {
      const title = this.isTeacherSelected ? slot.className : slot.title
      return {
        extendedProps: {
          id: slot.sessionId,
          subject: slot.subject,
          teachers: slot.teachers,
          room: slot.room
        },
        title,
        start: dayjs(slot.startDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DDTHH:mm'),
        end: dayjs(slot.endDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DDTHH:mm'),
        backgroundColor: slot.color,
        borderColor: slot.color
      }
    },
    onEventMount (info) {
      // Add infos in timegrid view
      const container = info.el.getElementsByClassName('fc-event-main-frame')[0]
      if (info.event.extendedProps.teachers) {
        const tag = document.createElement('div')
        const teachers = info.event.extendedProps.teachers
        let label = ''
        for (let index = 0; index < teachers.length; ++index) {
          if (!this.isTeacherSelected || teachers[index].userId !== this.$store.state.horaires.selectedUser.teacherId) {
            const name = teachers[index].firstName.substring(0, 1) + '. ' + teachers[index].lastName
            label += (label === '') ? name : ', ' + name
          }
        }
        tag.appendChild(document.createTextNode(label))
        container.appendChild(tag)
      }
      if (info.event.extendedProps.room) {
        const tag = document.createElement('div')
        tag.classList.add('fc-event-room')
        const label = info.event.extendedProps.room
        tag.appendChild(document.createTextNode(label))
        container.appendChild(tag)
      }
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
      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(date)
      }
      this.$store.dispatch('horaires/selectDates',
        { start: dayjs(date), end: dayjs(date).add(1, 'day') })
    },
    onSelectWeek (week) {
      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(new Date(week.firstDayOfWeek))
      }
      this.$store.dispatch('horaires/selectDates',
        { start: dayjs(week.firstDayOfWeek, 'YYYY-MM-DD'), end: dayjs(week.lastDayOfWeek, 'YYYY-MM-DD') })
    },
    onSlotMount (info) {
      // Change hour label to P1, P2...
      // const label = info.el.getElementsByClassName('fc-timegrid-slot-label-cushion')[0]
      // label.innerText = slotLabelList[info.text]
    },
    unselectEvent () {
      this.selectedEvent.el.parentNode.classList.remove('selected')
      this.selectedEvent = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  margin-bottom: 10px;
}
</style>

<style lang="scss">
@import 'src/design/fullcalendar';
</style>
