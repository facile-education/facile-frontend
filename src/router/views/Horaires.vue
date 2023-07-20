<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <HorairesToolbar
      v-if="!$store.state.user.isStudent || mq.phone"
      @update-sessions="getSessions"
    />

    <Timeline
      v-if="!mq.phone"
      :initial-date="selectedDate"
      @select-week="onSelectWeek"
    />

    <CustomCalendar
      :display-date="selectedDate"
      :events="eventList"
      @select-date="onSelectDate"
      @event-option-clicked="handleEventOption"
    />

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
      updatedSession: undefined,
      isEditModalDisplayed: false
    }
  },
  computed: {
    eventList () {
      return this.$store.state.horaires.sessionList
    },
    selectedDate () {
      return this.$store.state.horaires.selectedDate
    },
    isCreateSessionModalDisplayed () {
      return this.$store.state.horaires.isCreateSessionModalDisplayed
    },
    isLoading () {
      return this.$store.state.horaires.isLoading
    }
  },
  created () {
    if (this.$route.query.initialDisplayDate) {
      this.$store.dispatch('horaires/setSelectedDate', dayjs(this.$route.query.initialDisplayDate, 'YYYY/MM/DD'))
    } else {
      this.$store.dispatch('horaires/setSelectedDate', dayjs())
    }

    if (this.$store.state.user.isParent && this.$store.state.user.selectedChild !== undefined) {
      this.$store.dispatch('horaires/setSelectedUser', this.$store.state.user.selectedChild)
    } else {
      this.$store.dispatch('horaires/setSelectedUser', this.$store.state.user)
    }

    this.getSessions()
  },
  methods: {
    getSessions () {
      if (this.$store.state.horaires.selectedUser) {
        this.$store.dispatch('horaires/getUserSessions')
      } else if (this.$store.state.horaires.selectedGroup) {
        this.$store.dispatch('horaires/getGroupSessions')
      } else {
        this.$store.dispatch('horaires/resetSessions')
      }
    },
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
      if (refresh) {
        this.getSessions()
      }
    },
    closeCreateSessionModal (refresh) {
      this.isCreateSessionModalDisplayed = !this.isCreateSessionModalDisplayed
      if (refresh) {
        this.getSessions()
      }
    },
    onSelectDate (date) {
      this.$store.dispatch('horaires/setSelectedDate', dayjs(date))
      this.getSessions()
    },
    onSelectWeek (week) {
      this.$store.dispatch('horaires/setSelectedDate', dayjs(week.firstDayOfWeek).startOf('day'))
      this.getSessions()
    }
  }
}
</script>

<style lang="scss" scoped>
.v-spinner {
  z-index: 1;
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Horaires"
}
</i18n>
