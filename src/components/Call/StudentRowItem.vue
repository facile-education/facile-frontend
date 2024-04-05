<template>
  <tr>
    <td>
      {{ student.lastName + ' ' + student.firstName }}
    </td>
    <td />
    <td
      class="clickable"
      @click="toggleIsAbsence"
    >
      <span v-if="isAbsence">X</span>
    </td>
    <td
      class="clickable"
      :class="isAbsence && 'disabled'"
      @click="!isAbsence && !isLate && (isSetLateDurationModal = true)"
    >
      <p v-if="lateDuration">
        {{ lateDuration + ' ' + 'min' }}
      </p>
      <div
        v-if="isSetLateDurationModal"
        class="lateInput"
      >
        <label for="late">Durée du retard</label>
        <input
          id="late"
          v-model="lateDuration"
          type="number"
          name="late"
        >
        <WeprodeButton
          label="Valider"
          @click="setLateDuration"
        />
      </div>
    </td>
    <td
      class="clickable"
      :class="isAbsence && 'disabled'"
      @click="!isAbsence && (isFired = !isFired)"
    >
      <span v-if="isFired">X</span>
    </td>
    <td
      class="clickable"
      :class="isAbsence && 'disabled'"
      @click="!isAbsence && (isMedical = !isMedical)"
    >
      <span v-if="isMedical">X</span>
    </td>
    <td class="observation">
      <p
        v-if="formateObservation"
        class="content"
        v-html="formateObservation"
      />
      <p
        v-else
        class="content"
      >
        Observation...
      </p>
      <button
        class="option"
        aria-label="'Modifier'"
        title="Modifier"
        @keyup.stop
        @click="addObservation = true"
      >
        <CustomIcon
          class="icon"
          icon-name="icon-edit"
        />
      </button>
      <div
        v-if="addObservation"
        class="observationModal"
      >
        <TextContent
          v-model:content="observation"
          class="ck-editor"
          :placeholder="'Mon observation'"
        />
        <WeprodeButton
          label="Valider"
          @click="addObservation = false"
        />
      </div>
    </td>
  </tr>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import TextContent from '@components/Base/TextContent.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
export default {
  name: 'StudentRowitem',
  components: {
    CustomIcon,
    TextContent,
    WeprodeButton
  },
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isAbsence: false,
      isLate: false,
      isFired: false,
      isMedical: false,
      addObservation: false,
      observation: undefined,
      lateDuration: undefined,
      isSetLateDurationModal: false
    }
  },
  computed: {
    formateObservation () {
      if (this.observation) {
        if (this.observation && this.observation.length > 30) {
          return this.observation.substring(0, 30) + '...'
        } else {
          return this.observation
        }
      } else {
        return undefined
      }
    }

  },
  mounted () {
    window.addEventListener('click', this.clickOutside)
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    toggleIsAbsence () {
      this.isAbsence = !this.isAbsence
      if (this.isAbsence === true) {
        this.isFired = false
        this.isLate = false
        this.isMedical = false
      }
    },
    setLateDuration () {
      this.isLate = true
      this.isSetLateDurationModal = false
    },
    clickOutside (e) {
      const self = this
      if (self.$el && !self.$el.contains(e.target)) {
        this.isSetLateDurationModal = false
        this.addObservation = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
td, th {
    border: 1px solid rgb(160 160 160);
    padding: 8px 10px;
}

.clickable{
    position: relative;
    cursor: pointer;
    span{
        text-align: center;
        display: block;
    }
    &.disabled{
        cursor: not-allowed;
    }
    p{
        margin: 0;
    }
}

.lateInput{
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    background-color: white;
    label{
        align-self: flex-start;
    }
    input{
        margin-bottom: 5px;
        border: none;
        border-bottom: solid 2px;
        outline: none;
    }
}

.observationModal{
    width: 300px;
    height: 240px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    position: absolute;
    top: 0;
    right: 0;
    padding: 20px;
    background-color: white;
    .ck-editor{
        border: solid 1px;
        flex: 1;
    }
    button{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 30px !important;
    }
}

.observation{
    min-width: 300px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .content{
        margin: 0;
    }
    button{
        height: fit-content;
        border: none;
        cursor: pointer;
    }
}

td:last-of-type {
    text-align: center;
}
</style>
