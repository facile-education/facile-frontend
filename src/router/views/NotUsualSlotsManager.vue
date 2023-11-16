<template>
  <h1 :aria-label="$t('serviceTitle')" />
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
      <WeprodeDropdown
        v-if="currentUser.selectedSchool && currentSlotType && currentSlotType.type === 5"
        v-model="selectedClass"
        :placeholder="$t('groupFilter')"
        :list="classList"
        display-field="orgName"
        class="class-dropdown"
      />
      <UserCompletion
        v-if="currentSlotType"
        user-type="student"
        :placeholder="$t('NotUsualSlots.studentNamePlaceHolder')"
        :model-value="queriedUser ? [queriedUser] : []"
        class="user-completion"
        @update:model-value="getUserSlots"
      />
    </div>
    <HHCCalendar
      v-if="currentSlotType"
      :current-slot-type="currentSlotType"
    />

    <!-- global modals -->
    <template v-if="pendingFirings.length > 0">
      <PendingFiringModal
        v-for="(pendingFiring, index) in pendingFirings"
        :key="index"
        :pending-firing="pendingFiring"
        :full-screen="mq.phone"
        :closable="false"
      />
    </template>
  </div>
  <div v-else>
    <WeprodeSpinner v-if="areActionsInProgress" />
  </div>
</template>

<script>
import HHCCalendar from '@components/NotUsualSlotManager/HHCCalendar.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import schoolLifeService from '@/api/schoolLife-portlet.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import SelectedSchool from '@/components/NotUsualSlotManager/SelectedSchool'
import SlotTypeItem from '@/components/NotUsualSlotManager/SlotTypeItem'
import notUsualSlotConstants from '@/constants/notUsualSlots'

const PendingFiringModal = defineAsyncComponent(() => import('@/components/NotUsualSlotManager/PendingFiringModal/PendingFiringModal'))
const UserCompletion = defineAsyncComponent(() => import('@/components/NotUsualSlotManager/UserCompletion'))

export default {
  name: 'NotUsualSlotManager',
  components: { PendingFiringModal, SelectedSchool, UserCompletion, HHCCalendar, SlotTypeItem, WeprodeDropdown, WeprodeSpinner },
  inject: ['mq'],
  emits: ['update:layout'],
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
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
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
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    this.getPendingFirings()
    this.$store.dispatch('notUsualSlots/setDisplayedDates', {
      startDate: dayjs().startOf('week'),
      endDate: dayjs().endOf('week')
    })
    if (!this.mq.phone && !this.mq.tablet) { // Select a default slot type on desktop to not have a too much blank page
      this.$store.dispatch('notUsualSlots/setCurrentSlotType', this.slotTypes[0])
    }
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
    getUserSlots (value) {
      this.$store.dispatch('notUsualSlots/setQueriedUser', value[0])
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.non-classical-slots {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.slot-type-selection {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &.mobile {
    height: 100vh;
    align-content: space-around;
    justify-content: space-around;
  }
}

.filters {
  display: flex;
  margin: 1rem 0;

  .class-dropdown {
    min-width: 120px;
    margin: 0 1rem;
  }

  .user-completion {
    width: 100%;
  }
}
</style>

<i18n locale="fr">
{
  "groupFilter": "Groupe",
  "serviceTitle": "Horaires hors cadre"
}
</i18n>
