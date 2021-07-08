<template>
  <Layout>
    <HorairesToolbar class="toolbar" />
    <Timeline
      :min-date="minDate"
      :max-date="maxDate"
      @selectWeek="onSelectWeek"
    />
    <FullCalendar
      ref="fullCalendar"
      :options="calendarOptions"
    />
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

dayjs.extend(customParseFormat)

export default {
  name: 'Horaires',
  components: {
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
    minDate () {
      return dayjs('2020-09-01', 'YYYY-MM-DD')
    },
    maxDate () {
      return dayjs('2021-07-30', 'YYYY-MM-DD')
    },
    calendarOptions () {
      return {
        locale: frLocale,
        plugins: [timeGridPlugin],
        initialView: 'timeGridWeek', // TODO Change to timeGridDay on mobile
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
            hiddenDays: [6, 0], // TODO get from config service
            nowIndicator: true,
            slotDuration: '01:00:00',
            slotMinTime: '08:00:00', // TODO get from config service
            slotMaxTime: '18:00:00', // TODO get from config service
            slotLabelDidMount: this.onSlotMount
          }
        },
        events:
          this.eventList.map(slot => this.formatCalendarSlot(slot))
      }
    },
    eventList () {
      return this.$store.state.horaires.sessionList
    }
  },
  created () {
    this.$store.dispatch('user/initUserInformations')
    this.$store.dispatch('user/getPersonalDetails')
  },
  methods: {
    formatCalendarSlot (slot) {
      return {
        extendedProps: {
          id: slot.sessionId,
          subject: slot.title,
          teachers: slot.teachers,
          room: slot.room
        },
        title: slot.title,
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
          label += (index === 0) ? teachers[index].fullName : ', ' + teachers[index].fullName
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
