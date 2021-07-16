<template>
  <Layout>
    <div
      v-if="currentUser.userId !== 0 && currentUser.schoolList.length !== 0 && hasGoodRole"
      class="non-classical-slots"
    >
      <SelectedSchool />
      <div class="slot-type-selection">
        <SlotTypeItem
          v-for="(slotType, index) in slotTypes"
          :key="index"
          class="slot-type"
          :slot-type="slotType"
        />
      </div>
      <UserCompletion
        user-type="student"
        :placeholder="$t('NotUsualSlots.studentNamePlaceHolder')"
        @selectUser="getUserSlots"
      />
      <div class="calendar-container">
        <Calendar
          v-if="currentSlotType"
          :current-slot-type="currentSlotType"
        />
      </div>

      <!-- global modals -->
      <teleport
        v-if="isWarningModalDisplayed"
        to="body"
      >
        <WarningModal />
      </teleport>
      <teleport
        v-if="pendingFirings.length > 0"
        to="body"
      >
        <PendingFiringModal
          v-for="(pendingFiring, index) in pendingFirings"
          :key="index"
          :pending-firing="pendingFiring"
          :closable="false"
        />
      </teleport>
    </div>
    <div v-else>
      <PentilaSpinner v-if="areActionsInProgress" />
      <UnauthenticatedPage v-else />
    </div>
  </Layout>
</template>

<script>

import notUsualSlotConstants from '@/constants/notUsualSlots'
import moment from 'moment'
import schoolLifeService from '@/api/schoolLife-portlet.service'
import SlotTypeItem from '@/components/NotUsualSlotManager/SlotTypeItem'
import Calendar from '@/components/NotUsualSlotManager/Calendar'
import UserCompletion from '@/components/NotUsualSlotManager/UserCompletion'
import SelectedSchool from '@/components/NotUsualSlotManager/SelectedSchool'
import UnauthenticatedPage from '@/router/views/UnauthenticatedPage'
import WarningModal from '@components/Nero/WarningModal'
import Layout from '@layouts/EmptyLayout'
import PendingFiringModal from '@components/NotUsualSlotManager/PendingFiringModal/PendingFiringModal'

export default {
  name: 'NotUsualSlotManager',
  components: { PendingFiringModal, Layout, WarningModal, UnauthenticatedPage, SelectedSchool, UserCompletion, Calendar, SlotTypeItem },
  data () {
    return {
      slotTypes: notUsualSlotConstants.slotTypes,
      selectedSchool: undefined
    }
  },
  computed: {
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    },
    pendingFirings () { // TODO check for a sorted version of pendingFirings?
      console.log(this.$store.state.notUsualSlots.pendingFirings)
      return this.$store.state.notUsualSlots.pendingFirings
    },
    currentUser () {
      return this.$store.state.user
    },
    hasGoodRole () {
      return this.currentUser.isTeacher || this.currentUser.isPersonal
    },
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    },
    isWarningModalDisplayed () {
      return this.$store.getters['warningModal/isWarningModalDisplayed']
    }
  },
  created () {
    this.$store.dispatch('cdt/getConfiguration')
    this.getPendingFirings()
    this.$store.dispatch('notUsualSlots/setDisplayedDates', {
      startDate: moment().startOf('week'),
      endDate: moment().endOf('week')
    })
  },
  methods: {
    getPendingFirings () {
      schoolLifeService.getPendingFirings().then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/setPendingFirings', data.pendingRenvois)
        }
      },
      (err) => {
        console.error(err)
      })
    },
    getUserSlots (user) {
      this.$store.dispatch('notUsualSlots/setQueriedUser', user)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.non-classical-slots {
  width: 100%;
  height: 100%;
  font-family: "Roboto", sans-serif;
  color: $color-cadyco-dark-text;
}

.slot-type-selection {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.calendar-container {
  height: 85vh;
  padding-top: 20px;
}

</style>
