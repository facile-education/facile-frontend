<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <HorairesToolbar
      v-if="!$store.state.user.isStudent"
      :selected-date="selectedDate"
      @selectDate="onSelectDate"
    />
    <template v-if="configuration">
      <Timeline
        v-if="!mq.phone"
        @selectWeek="onSelectWeek"
      />

      <CustomCalendar
        :display-date="selectedDate"
        :events="eventList"
        @selectDate="onSelectDate"
        @eventOptionClicked="handleEventOption"
      />
    </template>

    <PentilaSpinner v-if="isLoading" />

    <teleport to="body">
      <SessionTeacherModal
        v-if="isEditModalDisplayed"
        :win-width="(mq.phone || mq.tablet) ? 'auto' : '650px'"
        :session-event="updatedSession"
        @close="closeEditModalDisplay"
      />
      <CreateSessionModal
        v-if="isCreateSessionModalDisplayed"
        :win-width="(mq.phone || mq.tablet) ? 'auto' : '650px'"
        @close="closeCreateSessionModal"
      />
    </teleport>
  </Layout>
</template>

<script>
import CustomCalendar from '@components/Base/CustomCalendar/CustomCalendar.vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
// Lazy loading
import { defineAsyncComponent } from 'vue'

import HorairesToolbar from '@/components/Horaires/HorairesToolbar'
import Layout from '@/router/layouts/BannerLayout'
const Timeline = defineAsyncComponent(() => import('@/components/Horaires/Timeline'))
const SessionTeacherModal = defineAsyncComponent(() => import('@/components/Horaires/SessionTeacherModal'))
const CreateSessionModal = defineAsyncComponent(() => import('@/components/Horaires/CreateSessionModal'))

dayjs.extend(customParseFormat)

export default {
  name: 'Horaires',
  components: {
    CustomCalendar,
    HorairesToolbar,
    Layout,
    SessionTeacherModal,
    CreateSessionModal,
    Timeline
  },
  inject: ['mq'],
  data () {
    return {
      isEditModalDisplayed: false,
      // pan: -320,
      pan: 0,
      selectedDate: dayjs(),
      updatedSession: undefined
    }
  },
  computed: {
    configuration () {
      return this.$store.state.calendar.configuration
    },
    eventList () {
      return this.$store.state.horaires.sessionList
    },
    isCreateSessionModalDisplayed () {
      return this.$store.state.horaires.isCreateSessionModalDisplayed
    },
    isLoading () {
      return this.$store.state.horaires.isLoading
    }
  },
  created () {
    if (this.configuration === undefined) {
      this.$store.dispatch('calendar/getConfiguration')
      if (this.mq.phone) {
        this.onSelectDate(new Date())
      }
    }
  },
  methods: {
    handleEventOption (eventOption) {
      switch (eventOption.option.name) {
        case 'saveTeacherSubstitute':
          this.updatedSession = eventOption.event
          this.isEditModalDisplayed = !this.isEditModalDisplayed
          break
        default:
          console.error('no option exist with name ' + eventOption.option.name)
          break
      }
    },
    closeEditModalDisplay (refresh) {
      this.isEditModalDisplayed = !this.isEditModalDisplayed
      // force refresh calendar if changes are applied
      if (refresh) {
        this.$store.dispatch('horaires/selectDates',
          { start: this.$store.state.horaires.startDate, end: this.$store.state.horaires.endDate })
      }
    },
    closeCreateSessionModal (refresh) {
      this.isCreateSessionModalDisplayed = !this.isCreateSessionModalDisplayed
      // force refresh calendar if changes are applied
      if (refresh) {
        this.$store.dispatch('horaires/selectDates',
          { start: this.$store.state.horaires.startDate, end: this.$store.state.horaires.endDate })
      }
    },
    onSelectDate (date) {
      this.selectedDate = dayjs(date).startOf('day')

      this.$store.dispatch('horaires/selectDates',
        { start: dayjs(date).subtract(1, 'day'), end: dayjs(date).add(2, 'day') })
    },
    onSelectWeek (week) {
      this.selectedDate = dayjs(week.firstDayOfWeek).startOf('day')

      this.$store.dispatch('horaires/selectDates',
        { start: dayjs(week.firstDayOfWeek, 'YYYY-MM-DD'), end: dayjs(week.lastDayOfWeek, 'YYYY-MM-DD') })
    }
  }
}
</script>

<style lang="scss" scoped>
.swipe-container {
  overflow-x: hidden;
  height: max(800px, calc(100% - 125px));
}

.swipe-wrapper {
  transition-duration: 320ms;
  height: 100%;
  display: flex;
  transition-property: transform;
  width: 100%
}

.calendar {
  transition-property: transform;
  position: relative;
  flex-shrink: 0;
  width: 100%;
}

.v-spinner {
  z-index: 1;
}
</style>

<style lang="scss">
@import 'src/design/fullcalendar';
</style>

<i18n locale="fr">
{
  "serviceTitle": "Horaires"
}
</i18n>
