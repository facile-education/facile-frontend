<template>
  <div class="calendar">
    <h3> {{ 'Affichage des créneaux ' + currentSlotType.label }} </h3>
    <button @click="openAddSlotModal">
      Ajouter un nouveau créneau
    </button>
    <div class="slots-to-display">
      <div
        v-for="(slot, index) in allSlotsToDisplay"
        :key="index"
        class="slot"
        :style="'background-color: ' + slot.color + ';'"
      >
        <div class="title">
          {{ slot.subject }}
        </div>
        <div class="start">
          {{ 'Début: ' + slot.sessionStart }}
        </div>
        <div class="end">
          {{ 'Fin: ' + slot.sessionEnd }}
        </div>
        <div class="room">
          {{ slot.room }}
        </div>
        <!--        <div class="teacher">{{slot.subject}}</div>-->
      </div>
    </div>
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
      isAddSlotModalDisplayed: false
    }
  },
  computed: {
    userSlots () {
      return this.$store.state.notUsualSlots.userSlots
    },
    currentNonUsualSlots () {
      return this.$store.state.notUsualSlots.currentNonUsualSlots
    },
    allSlotsToDisplay () {
      return [...this.userSlots, ...this.currentNonUsualSlots]
    }
  },
  methods: {
    openAddSlotModal () {
      this.isAddSlotModalDisplayed = true
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar {
  height: 100%;
  width: 100%;
  border: 1px solid #D9E2EA;
  padding: 5px;
  overflow: auto;
}

h3 {
  text-align: center;
}

.slots-to-display {
  display: flex;
  flex-wrap: wrap;
}

.slot {
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 10px;
  padding: 10px;

  .title {
    font-weight: bold;
  }

  .room {
    font-style: italic;
  }
}
</style>
