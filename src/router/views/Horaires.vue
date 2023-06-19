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
        :min-date="minDate"
        :max-date="maxDate"
        @selectWeek="onSelectWeek"
      />
      <!--      <div-->
      <!--        v-if="mq.phone"-->
      <!--        v-touch:swipe.left="onSwipeLeft"-->
      <!--        v-touch:swipe.right="onSwipeRight"-->
      <!--        class="swipe-container"-->
      <!--      >-->
      <!--        <div-->
      <!--          class="swipe-wrapper"-->
      <!--          :style="`transform: translate3d(${pan}px, 0px, 0px);`"-->
      <!--        >-->
      <!--          <FullCalendar-->
      <!--            ref="fullCalendar"-->
      <!--            class="calendar"-->
      <!--            :options="calendarOptions"-->
      <!--          >-->
      <!--            <template #eventContent="arg">-->
      <!--              <FCEvent-->
      <!--                :arg="arg"-->
      <!--                @update="openEditModalDisplay"-->
      <!--              />-->
      <!--            </template>-->
      <!--          </FullCalendar>-->
      <!--        </div>-->
      <!--      </div>-->

      <CustomCalendar
        :display-date="selectedDate"
        :events="eventList"
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
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Layout from '@/router/layouts/BannerLayout'
import HorairesToolbar from '@/components/Horaires/HorairesToolbar'

// Lazy loading
import { defineAsyncComponent } from 'vue'
import CustomCalendar from '@components/Base/CustomCalendar/CustomCalendar.vue'
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
      return this.$store.state.horaires.configuration
    },
    eventList () {
      return this.$store.state.horaires.sessionList
    },
    isCreateSessionModalDisplayed () {
      return this.$store.state.horaires.isCreateSessionModalDisplayed
    },
    isLoading () {
      return this.$store.state.horaires.isLoading || !this.configuration
    },
    minDate () {
      return dayjs(this.configuration.schoolYearStartDate, 'YYYY-MM-DD')
    },
    maxDate () {
      return dayjs(this.configuration.schoolYearEndDate, 'YYYY-MM-DD')
    }
  },
  watch: {
    mq: { // To correctly handle date and slots when we move from portrait to landscape
      deep: true,
      handler (value) {
        if (!value.desktop) {
          if (this.$refs.fullCalendar) {
            const calendar = this.$refs.fullCalendar.getApi()
            calendar.gotoDate(this.selectedDate.toDate())
          }
        }
      }
    }
  },
  created () {
    if (this.configuration === undefined) {
      this.$store.dispatch('horaires/getConfiguration')
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
    nextDate () {
      this.selectedDate = this.selectedDate.add(1, 'day')
      // Skip hidden days
      if (this.configuration.schoolDays.indexOf(this.selectedDate.day()) === -1) {
        this.nextDate()
      } else {
        this.onSelectDate(this.selectedDate.toDate())
      }
    },
    onSelectDate (date) {
      this.selectedDate = dayjs(date).startOf('day')

      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(date)
      }

      this.$store.dispatch('horaires/selectDates',
        { start: dayjs(date).subtract(1, 'day'), end: dayjs(date).add(2, 'day') })
    },
    onSelectWeek (week) {
      this.selectedDate = dayjs(week.firstDayOfWeek).startOf('day')

      if (this.$refs.fullCalendar) {
        const calendar = this.$refs.fullCalendar.getApi()
        calendar.gotoDate(new Date(week.firstDayOfWeek))
      }
      this.$store.dispatch('horaires/selectDates',
        { start: dayjs(week.firstDayOfWeek, 'YYYY-MM-DD'), end: dayjs(week.lastDayOfWeek, 'YYYY-MM-DD') })
    },
    onSwipeLeft () {
      if (this.mq.phone) {
        this.nextDate()
      }
    },
    onSwipeRight () {
      if (this.mq.phone) {
        this.previousDate()
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
