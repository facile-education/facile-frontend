<template>
  <div
    class="footer"
    :class="{'phone': mq.phone}"
  >
    <div
      v-if="displayRecap"
      class="recap"
      :class="{'phone': mq.phone}"
    >
      <h3>{{ $t('Call.summary') }}</h3>

      <ul class="recapItems">
        <li
          v-if="nbAbsence > 0"
          :title="$tc('Call.nbAbsence', nbAbsence)"
        >
          {{ nbAbsence }}
          <div
            class="icon-container red"
            :class="{'inactive': nbAbsence === 0}"
          >
            <CustomIcon icon-name="icon-user-24" />
          </div>
        </li>
        <li
          v-if="nbLate > 0"
          :title="$tc('Call.nbLate', nbLate)"
        >
          {{ nbLate }}
          <div class="icon-container orange">
            <CustomIcon icon-name="icon-clock" />
          </div>
        </li>
        <li
          v-if="nbFired > 0"
          :title="$tc('Call.nbFired', nbFired)"
        >
          {{ nbFired }}
          <div class="icon-container orange">
            <CustomIcon icon-name="icon-out" />
          </div>
        </li>
        <li
          v-if="nbMedical > 0"
          :title="$tc('Call.nbMedical', nbMedical)"
        >
          {{ nbMedical }}
          <div class="icon-container orange">
            <CustomIcon icon-name="icon-soin" />
          </div>
        </li>
        <li
          v-if="nbNotes > 0"
          :title="$tc('Call.nbNotes', nbNotes)"
        >
          {{ nbNotes }}
          <div class="icon-container white">
            <CustomIcon icon-name="icon-edit" />
          </div>
        </li>
      </ul>
    </div>
    <WeprodeButton
      v-if="canEditCall"
      class="submit-button"
      :label="$t('Call.save')"
      @click="$emit('doCall')"
    />
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

export default {
  name: 'CallModalFooter',
  components: {
    CustomIcon,
    WeprodeButton
  },
  inject: ['mq'],
  props: {
    call: {
      type: Object,
      required: true
    },
    canEditCall: {
      type: Boolean,
      default: false
    }
  },
  emits: ['doCall'],
  computed: {
    nbAbsence () {
      return this.call.students.filter(student => student.isAbsent).length
    },
    nbFired () {
      return this.call.students.filter(student => student.isFired).length
    },
    nbLate () {
      return this.call.students.filter(student => student.isLate).length
    },
    nbMedical () {
      return this.call.students.filter(student => student.isMedical).length
    },
    nbNotes () {
      return this.call.students.filter(student => student.comment).length
    },
    displayRecap () {
      return this.nbAbsence + this.nbFired + this.nbLate + this.nbMedical + this.nbNotes > 0
    }
  }
}
</script>

<style scoped lang="scss">
@import "@design";

.footer:not(.phone) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.recap {
  text-align: center;
}
.recap:not(.phone) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;

  ul {
    justify-content: flex-start;
  }
}

h3{
  @extend %font-heading-xs;
}

.recap.phone {
  h3{
    margin: 0 0 1rem 0;
  }
}

ul{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-left: 0;

  li{
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.icon-container {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.30);

  &.orange {
    background-color: $warning;
  }
  &.red {
    background-color: $danger;
  }
  &.white {
    background-color: white;
    color: black;
  }
  &.inactive {
    background-color: white;
    color: black;
    opacity: 0.3%;
  }
}

.submit-button {
  margin-left: auto;
}
</style>
