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
      <PentilaButton
        v-t="'addSlot'"
        @click="addSlot"
      />
    </div>

    <footer>
      <PentilaButton
        v-t="'submit'"
        @click="saveSchoolSlotConfiguration"
      />
    </footer>
  </section>
</template>

<script>
import { getSchoolSlotConfiguration, saveSchoolSlotConfiguration } from '@/api/schedule.service'
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
  computed: {
    slotsWithPosition () {
      const slotsWithPosition = [...this.slots]
      for (let i = 0; i < this.slots.length; i++) {
        slotsWithPosition[i].slotNumber = i + 1
      }
      return slotsWithPosition
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
    saveSchoolSlotConfiguration () {
      saveSchoolSlotConfiguration(this.selectedSchool.schoolId, this.slotsWithPosition).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
          this.getSchoolSlotsConfiguration()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error('Error')
        }
      }, (err) => {
        this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
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
}
</style>

<i18n locale="fr">
{
  "schoolSlots": "Créneaux horaires de l'établissement",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "addSlot": "Ajouter un créneau",
  "submit": "Valider les créneaux",
  "success": "Créneaux mis à jour",
  "error": "Échec de l'enregistrement"
}
</i18n>
