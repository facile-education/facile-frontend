<template>
  <section>
    <h2 v-t="('ScheduleManager.SchoolSlots.schoolSlots')" />
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'ScheduleManager.SchoolSlots.errorPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      <ol>
        <li
          v-for="(slot, index) in slots"
          :key="slot.slotStartHour"
        >
          <SchoolSlotItem
            v-model:slot="slots[index]"
            :position="index"
            @delete="deleteSlot(index)"
          />
        </li>
      </ol>
      <WeprodeButton
        v-t="'ScheduleManager.SchoolSlots.addSlot'"
        @click="addSlot"
      />
    </div>

    <footer>
      <div class="right">
        <WeprodeButton
          v-t="'ScheduleManager.SchoolSlots.submit'"
          @click="submit"
        />
        <WeprodeErrorMessage :error-message="formErrorList.slots" />
      </div>
    </footer>
  </section>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import SchoolSlotItem from '@components/ScheduleManager/SchoolScheduleSettings/SchoolSlotItem.vue'
import { useVuelidate } from '@vuelidate/core'
import dayjs from 'dayjs'

import { getSchoolSlotConfiguration, saveSchoolSlotConfiguration } from '@/api/schedule.service'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'SchoolSlots',
  components: { WeprodeButton, SchoolSlotItem, WeprodeErrorMessage, WeprodeSpinner },
  props: {
    selectedSchool: {
      type: Object,
      required: true
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      isLoading: false,
      error: false,
      slots: []
    }
  },
  validations: {
    slots: {
      function () {
        return !this.isSlotsOverlaps
      }
    }
  },
  computed: {
    slotsWithPosition () {
      const slotsWithPosition = [...this.slots]
      for (let i = 0; i < this.slots.length; i++) {
        slotsWithPosition[i].slotNumber = i + 1
      }
      return slotsWithPosition
    },
    isSlotsOverlaps () {
      // For each slot
      for (let i = 0; i < this.slots.length; i++) {
        const currentSlot = this.slots[i]
        // Check if current slot startDate if after all the previous slots endDate
        for (let j = 0; j < i; j++) {
          const previousSlot = this.slots[j]
          const today = dayjs()
          const previousSlotEndDate = dayjs(today.format('YYYY/MM/DD') + ' ' + previousSlot.slotEndHour, 'YYYY/MM/DD HH:mm')
          const currentSlotStartDate = dayjs(today.format('YYYY/MM/DD') + ' ' + currentSlot.slotStartHour, 'YYYY/MM/DD HH:mm')
          if (currentSlotStartDate.isBefore(previousSlotEndDate)) {
            return true
          }
        }
        // Check if current slot endDate if before all the next slots startDate
        for (let h = i + 1; h < this.slots.length; h++) {
          const nextSlot = this.slots[h]
          const today = dayjs()
          const nextSlotStartDate = dayjs(today.format('YYYY/MM/DD') + ' ' + nextSlot.slotStartHour, 'YYYY/MM/DD HH:mm')
          const currentSlotEndDate = dayjs(today.format('YYYY/MM/DD') + ' ' + currentSlot.slotEndHour, 'YYYY/MM/DD HH:mm')
          if (currentSlotEndDate.isAfter(nextSlotStartDate)) {
            return true
          }
        }
      }
      return false
    },
    formErrorList () {
      return {
        slots: (this.v$.slots.$invalid && this.v$.slots.$dirty)
          ? this.$t('ScheduleManager.SchoolSlots.slotsOverlaps')
          : ''
      }
    }
  },
  watch: {
    selectedSchool () {
      this.getSchoolSlotsConfiguration()
    }
  },
  created () {
    this.getSchoolSlotsConfiguration()
  },
  methods: {
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.saveSchoolSlotConfiguration()
      }
    },
    getSchoolSlotsConfiguration () {
      this.isLoading = true
      getSchoolSlotConfiguration(this.selectedSchool.schoolId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.slots = data.configuration
          // Sort slots by slotNumber
          this.slots.sort((a, b) => { return a.slotNumber - b.slotNumber })
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.error = err
        console.log(err)
      })
    },
    saveSchoolSlotConfiguration () {
      saveSchoolSlotConfiguration(this.selectedSchool.schoolId, this.slotsWithPosition).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('ScheduleManager.SchoolSlots.success'), type: 'success' })
          this.getSchoolSlotsConfiguration()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('ScheduleManager.SchoolSlots.error'), type: 'error' })
          console.error('Error')
        }
      }, (err) => {
        this.$store.dispatch('popups/pushPopup', { message: this.$t('ScheduleManager.SchoolSlots.error'), type: 'error' })
        console.error(err)
      })
    },
    addSlot () {
      let slotStartHour = dayjs()
      if (this.slots.length > 0) {
        const previousSlotHour = (this.slots[this.slots.length - 1].slotEndHour)
        slotStartHour = slotStartHour.set('hour', Number(previousSlotHour.split(':')[0])).set('minute', Number(previousSlotHour.split(':')[1]))
        slotStartHour = slotStartHour.add(5, 'minute')
      }
      this.slots.push({
        slotStartHour: slotStartHour.format('HH:mm'),
        slotEndHour: slotStartHour.add(45, 'minute').format('HH:mm')
      })
    },
    deleteSlot (index) {
      this.slots.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  position: relative;
}

ol {
  margin-left: 1rem;
  padding: 0;
  list-style-type: none;
  cursor: pointer;
}

.placeholder {
  height: 45px;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1rem;
}

footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;

  .right {
    text-align: right;
  }
}
</style>
