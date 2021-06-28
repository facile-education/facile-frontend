<template>
  <div class="calendar">
    <h3> {{ 'Affichage des créneaux ' + currentSlotType.label }} </h3>
    <button @click="openAddSlotModal">
      Ajouter un nouveau créneau
    </button>
  </div>
  <teleport to="body">
    <AddSlotModal
      v-if="isAddSlotModalDisplayed"
      @close="isAddSlotModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import AddSlotModal from '@/components/NotUsualSlotManager/EditSlotModal'
export default {
  name: 'Calendar',
  components: { AddSlotModal },
  props: {
    currentSlotType: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isAddSlotModalDisplayed: false,
      isAddTutoringSlotModalDisplayed: false,
      isAddStudySlotModalDisplayed: false,
      isAddReplayTestSlotModalDisplayed: false,
      isAddDetentionSlotModalDisplayed: false,
      isAddFiredSlotModalDisplayed: false
    }
  },
  methods: {
    openAddSlotModal () {
      switch (this.currentSlotType.type) {
        case 'tutoring':
          this.openAddTutoringSlotModal()
          break
        case 'study':
          this.openAddStudySlotModal()
          break
        case 'replayTest':
          this.openAddReplayTestSlotModal()
          break
        case 'detention':
          this.openAddDetentionSlotModal()
          break
        case 'fired':
          this.openAddFiredSlotModal()
          break
        default:
          console.error('Slot type ' + this.currentSlotType.type + 'is unknown')
      }
    },
    openAddTutoringSlotModal () {
      this.isAddSlotModalDisplayed = true
      this.isAddTutoringSlotModalDisplayed = true
    },
    openAddStudySlotModal () {
      this.isAddSlotModalDisplayed = true
      this.isAddStudySlotModalDisplayed = true
    },
    openAddReplayTestSlotModal () {
      this.isAddSlotModalDisplayed = true
      this.isAddReplayTestSlotModalDisplayed = true
    },
    openAddDetentionSlotModal () {
      this.isAddSlotModalDisplayed = true
      this.isAddDetentionSlotModalDisplayed = true
    },
    openAddFiredSlotModal () {
      this.isAddSlotModalDisplayed = true
      this.isAddFiredSlotModalDisplayed = true
    }
  }
}
</script>

<style scoped>
.calendar {
  height: 100%;
  width: 100%;
  border: 1px solid #D9E2EA;
  color: #0B3C5F;
  padding: 5px;
}

h3 {
  text-align: center;
}
</style>
