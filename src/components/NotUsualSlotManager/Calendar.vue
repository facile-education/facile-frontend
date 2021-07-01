<template>
  <div class="calendar">
    <h3> {{ 'Affichage des créneaux ' + currentSlotType.label }} </h3>
    <button @click="openAddSlotModal">
      Ajouter un nouveau créneau
    </button>
    <FullCalendar
      ref="fullCalendar"
      :options="calendarOptions"
    />
    <EventPopover
      :selected-event="selectedEvent"
      @close="unselectEvent"
    />
    <div class="slots-to-display">
      <div
        v-for="(slot, index) in allSlotsToDisplay"
        :key="index"
        class="slot"
        :style="'background-color: ' + slot.color + ';'"
      >
        <div class="title">
          {{ slot.subject }}
        </div>
        <div class="start">
          {{ 'Début: ' + slot.sessionStart }}
        </div>
        <div class="end">
          {{ 'Fin: ' + slot.sessionEnd }}
        </div>
        <div class="room">
          {{ slot.room }}
        </div>
        <!--        <div class="teacher">{{slot.subject}}</div>-->
      </div>
    </div>
  </div>
  <teleport to="body">
    <AddSlotModal
      v-if="isAddSlotModalDisplayed"
      @close="isAddSlotModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { slotLabelList } from '@/utils/constant.util'

import AddSlotModal from '@/components/NotUsualSlotManager/EditSlotModal'
import EventPopover from '@/components/NotUsualSlotManager/EventPopover'
import FullCalendar from '@fullcalendar/vue3'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // Needed for event creation

export default {
  name: 'Calendar',
  components: {
    AddSlotModal,
    EventPopover,
    FullCalendar
  },
  props: {
    currentSlotType: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isAddSlotModalDisplayed: false,
      selectedEvent: undefined
    }
  },
  computed: {
    calendarOptions () {
      return {
        locale: frLocale,
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek', // TODO Change to timeGridDay on mobile
        height: '100%',
        expandRows: true,
        headerToolbar: {
          left: 'prev,next today',
          center: '',
          right: ''
        },
        selectable: true,
        select: this.onDateSelect,
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
          [
            // classNames attribut could be useful for disabled class
            { extendedProps: { id: 14854, subject: 'Mathématiques', teacher: 'Louisa Nécib', inscriptionLeft: 'Complet' }, title: 'Soutien scolaire - S 102', start: '2021-06-29T11:00:00+00:00', end: '2021-06-29T12:30:00+00:00', backgroundColor: '#445566', borderColor: '#445566' },
            { extendedProps: { id: 14855, teacher: 'Lisandro Lopez' }, title: 'Lunch - Cantine', start: '2021-06-29T12:00:00+00:00', backgroundColor: '#DD5522', borderColor: '#DD5522' },
            { editable: true, title: 'Birthday Party', start: '2021-06-30T10:00:00+00:00', backgroundColor: '#5555DD', borderColor: '#5555DD' },
            { extendedProps: { id: 14856, teacher: 'Florent Malouda', inscriptionLeft: '7' }, title: 'Barbecue Party', start: '2021-06-29T07:00:00+00:00', backgroundColor: '#55DDDD', borderColor: '#55DDDD' },
            { extendedProps: { id: 14856, teacher: 'Elise Bussaglia', inscriptionLeft: '12' }, title: 'Killing Party - S 301', start: '2021-07-02T09:00:00+00:00', backgroundColor: '#ED55DD', borderColor: '#ED55DD' },
            { extendedProps: { id: 14856, teacher: 'Camille Abily', inscriptionLeft: '8' }, title: 'Goodbye Party', start: '2021-07-01T08:00:00+00:00', backgroundColor: '#55EE99', borderColor: '#55EE99' }
          ]
      }
    },
    userSlots () {
      return this.$store.state.notUsualSlots.userSlots
    },
    currentNonUsualSlots () {
      return this.$store.state.notUsualSlots.currentNonUsualSlots
    },
    allSlotsToDisplay () {
      return [...this.userSlots, ...this.currentNonUsualSlots]
    }
  },
  methods: {
    openAddSlotModal () {
      this.isAddSlotModalDisplayed = true
    },
    onDateSelect (selection) {
      // console.log('Date selected !', selection)
      if (this.selectedEvent) {
        this.unselectEvent()
      }

      // TODO display add modal and add event only on success
      const calendar = this.$refs.fullCalendar.getApi()

      calendar.addEvent({
        title: 'New event',
        start: selection.start,
        end: selection.end
      })

      calendar.unselect()
    },
    onEventClick (info) {
      // console.log('clicked !', info)
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
    onEventMount (info) {
      // console.log('mounted !', info)
      // Add infos in timegrid view
      const container = info.el.getElementsByClassName('fc-event-main-frame')[0]
      if (info.event.extendedProps.teacher) {
        const tag = document.createElement('div')
        let label = info.event.extendedProps.teacher
        if (info.event.extendedProps.subject) {
          label += ' - ' + info.event.extendedProps.subject
        }
        tag.appendChild(document.createTextNode(label))
        container.appendChild(tag)
      }
      if (info.event.extendedProps.inscriptionLeft) {
        const tag = document.createElement('div')
        tag.classList.add('fc-event-inscription')
        tag.appendChild(document.createTextNode(info.event.extendedProps.inscriptionLeft))
        container.appendChild(tag)
      }
    },
    onSlotMount (info) {
      // console.log('mounted slot', info.text)
      // Change hour label to P1, P2...
      const label = info.el.getElementsByClassName('fc-timegrid-slot-label-cushion')[0]
      label.innerText = slotLabelList[info.text]
    },
    unselectEvent () {
      this.selectedEvent.el.parentNode.classList.remove('selected')
      this.selectedEvent = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar {
  height: 100%;
  width: 100%;
  border: 1px solid #D9E2EA;
  padding: 5px;
  overflow: auto;
}

h3 {
  text-align: center;
}

.slots-to-display {
  display: flex;
  flex-wrap: wrap;
}

.slot {
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 10px;
  padding: 10px;

  .title {
    font-weight: bold;
  }

  .room {
    font-style: italic;
  }
}
</style>

<style lang="scss">
$default-background-filter-color: #FFFFFFDD;
$selected-background-filter-color: #FFFFFF99;

.fc-timegrid-slots tr {
  border-top: 1px dotted silver;
  border-bottom: 1px dotted silver;
}

.fc-timegrid-event-harness {
  transition: inset .1s;

  &.selected {
    inset-inline-start: 0% !important;
    inset-inline-end: 0% !important;
    z-index: 10 !important;

    .fc-timegrid-event .fc-event-main {
      background-color: $selected-background-filter-color;
    }
  }

  &:hover .fc-timegrid-event .fc-event-main {
      background-color: $selected-background-filter-color;
  }
}

.fc-timegrid-event {
  border: none;
  border-left: 4px solid;
  border-radius: 0;

  .fc-event-main {
    background-color: $default-background-filter-color;
    padding-left: 4px;
  }

  .fc-event-time {
    display: none;
  }

  .fc-event-title-container {
    flex-grow: 0;
  }

  .fc-event-inscription {
    margin-top: auto;
    margin-right: 5px;
    text-align: right;
  }
}
</style>
