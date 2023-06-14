<template>
  <section>
    <h2 v-t="('schoolSlots')" />
    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      <ul>
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
      </ul>
      <PentilaButton
        v-t="'addSlot'"
        @click="addSlot"
      />
    </div>
  </section>
</template>

<script>
import { getSchoolSlotConfiguration } from '@/api/schedule.service'
import dayjs from 'dayjs'
import SchoolSlotItem from '@components/ScheduleManager/SchoolScheduleSettings/SchoolSlotItem.vue'

export default {
  name: 'SchoolSlots',
  components: { SchoolSlotItem },
  props: {
    selectedSchool: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      error: false,
      slots: []
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

</style>

<i18n locale="fr">
{
  "schoolSlots": "Créneaux horaires de l'établissement",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "addSlot": "Ajouter un créneau"
}
</i18n>
