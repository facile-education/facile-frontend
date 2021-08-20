<template>
  <Layout :is-allowed="hasGoodRole">
    <div
      v-if="currentUser.userId !== 0 && currentUser.schoolList.length !== 0"
      class="non-classical-slots"
    >
      <SelectedSchool />
      <div
        v-if="mq.desktop || currentSlotType === undefined"
        class="slot-type-selection"
        :class="{'mobile': !mq.desktop}"
      >
        <SlotTypeItem
          v-for="(slotType, index) in slotTypes"
          :key="index"
          class="slot-type"
          :slot-type="slotType"
        />
      </div>
      <div
        v-if="mq.desktop"
        class="filters"
      >
        <PentilaDropdown
          v-if="currentUser.selectedSchool && currentSlotType && currentSlotType.type === 5"
          v-model="selectedClass"
          :placeholder="$t('Horaires.groupFilter')"
          :list="classList"
          display-field="className"
          class="class-dropdown"
        />
        <UserCompletion
          v-if="currentSlotType"
          user-type="student"
          :placeholder="$t('NotUsualSlots.studentNamePlaceHolder')"
          :initial-user-list="queriedUser ? [queriedUser] : []"
          class="user-completion"
          @selectUser="getUserSlots"
        />
      </div>
      <Calendar
        v-if="currentSlotType"
        :current-slot-type="currentSlotType"
      />

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
          :is-full-screen="mq.phone"
          :closable="false"
        />
      </teleport>
    </div>
    <div v-else>
      <PentilaSpinner v-if="areActionsInProgress" />
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
import WarningModal from '@components/Nero/WarningModal'
import Layout from '@layouts/EmptyLayout'
import PendingFiringModal from '@components/NotUsualSlotManager/PendingFiringModal/PendingFiringModal'

export default {
  name: 'NotUsualSlotManager',
  components: { PendingFiringModal, Layout, WarningModal, SelectedSchool, UserCompletion, Calendar, SlotTypeItem },
  inject: ['mq'],
  data () {
    return {
      slotTypes: notUsualSlotConstants.slotTypes
    }
  },
  computed: {
    areActionsInProgress () {
      return this.$store.getters['currentActions/areActionsInProgress']
    },
    classList () {
      if (this.currentUser.selectedSchool && !this.$store.state.notUsualSlots.classList) {
        this.$store.dispatch('notUsualSlots/getClassList', this.$store.state.user.selectedSchool.schoolId)
      }
      return this.$store.state.notUsualSlots.classList || []
    },
    pendingFirings () { // TODO check for a sorted version of pendingFirings?
      return this.$store.state.notUsualSlots.pendingFirings
    },
    currentUser () {
      return this.$store.state.user
    },
    queriedUser () {
      return this.$store.state.notUsualSlots.queriedUser
    },
    hasGoodRole () {
      return this.currentUser.isTeacher || this.currentUser.isDoyen || this.currentUser.isDirectionMember || this.currentUser.isSecretariat
    },
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    },
    isWarningModalDisplayed () {
      return this.$store.getters['warningModal/isWarningModalDisplayed']
    },
    selectedClass: {
      get () {
        return this.$store.state.notUsualSlots.selectedClass
      },
      set (classObject) {
        this.$store.dispatch('notUsualSlots/setSelectedClass', classObject)
      }
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
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.slot-type-selection {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;

  &.mobile {
    height: 100vh;
    align-content: space-around;
    justify-content: space-around;
  }
}

.filters {
  display: flex;

  .class-dropdown {
    min-width: 120px;
    margin: 0 1rem;
  }

  .user-completion {
    width: 100%;
  }
}
</style>
