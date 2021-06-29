<template>
  <div class="container">
    <div class="editSlotModal">
      <div
        class="close-modal"
        @click="closeModal"
      >
        X
      </div>
      <h3 v-t="'NotUsualSlots.EditSlotModal.slot'" />
      <h3> {{ currentSlotType.label }}</h3>
      <PentilaInput
        v-model="teacherName"
        class="input"
        :placeholder="$t('NotUsualSlots.EditSlotModal.teacherNamePlaceHolder')"
      />
      <PentilaInput
        v-model="roomName"
        class="input"
        :placeholder="$t('NotUsualSlots.EditSlotModal.roomNamePlaceHolder')"
      />
      <div class="footer">
        <div
          v-t="'Commons.delete'"
          class="button delete-button"
          @click="deleteSlot"
        />
        <div
          v-t="'Commons.submit'"
          class="button confirm-button"
          @click="createSlot"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditSlotModal',
  emits: ['close'],
  data () {
    return {
      teacherName: '',
      roomName: '',
      slotCapacity: undefined,
      slotStart: undefined,
      slotEnd: undefined
    }
  },
  computed: {
    currentSlotType () {
      return this.$store.state.notUsualSlots.currentSlotType
    }
  },
  methods: {
    deleteSlot () {
      this.closeModal()
    },
    createSlot () {
      this.closeModal()
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

.container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(128, 128, 128, 0.5);
}

.editSlotModal {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 335px;
  width: 375px;
  border-radius: 6px;
  background-color: #F3F6F8;
  padding: 5px;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  height: 32px;
  width: 32px;
  border-radius: 16px;
  background-color: gray;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input {
  margin: 10px 0;
}

.footer {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.button {
  display: flex;
  font-weight: bold;
  width: 125px;
  height: 35px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  color: white;
  cursor: pointer;
}

.delete-button {
  background-color: red;
}

.confirm-button {
  background-color: #C4C4C4;
}

</style>
