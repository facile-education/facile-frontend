<template>
  <div
    class="footer"
    :class="{'phone': mq.phone}"
  >
    <div
      v-if="displayRecap"
      class="recap"
      :class="{'phone': mq.phone}"
      data-test="call-summary"
    >
      <h3>{{ $t(mq.phone ? 'Call.shortSummary' : 'Call.summary') }}</h3>

      <ul class="recapItems">
        <li
          v-if="nbAbsence > 0"
          data-test="absence-count"
          :title="$tc('Call.nbAbsence', nbAbsence)"
        >
          {{ nbAbsence }}
          <div
            class="icon-container red"
            :class="{'inactive': nbAbsence === 0}"
          >
            <CustomIcon icon-name="icon-no-user" />
          </div>
        </li>
        <li
          v-if="nbLate > 0"
          data-test="late-count"
          :title="$tc('Call.nbLate', nbLate)"
        >
          {{ nbLate }}
          <div class="icon-container orange">
            <CustomIcon icon-name="icon-clock" />
          </div>
        </li>
        <li
          v-if="nbFired > 0"
          data-test="fired-count"
          :title="$tc('Call.nbFired', nbFired)"
        >
          {{ nbFired }}
          <div class="icon-container orange">
            <CustomIcon icon-name="icon-out" />
          </div>
        </li>
        <li
          v-if="nbMedical > 0"
          data-test="medical-count"
          :title="$tc('Call.nbMedical', nbMedical)"
        >
          {{ nbMedical }}
          <div class="icon-container orange">
            <CustomIcon icon-name="icon-soin" />
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
    displayRecap () {
      return this.nbAbsence + this.nbFired + this.nbLate + this.nbMedical > 0
    }
  }
}
</script>

<style scoped lang="scss">
@import "@design";

.footer:not(.phone) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 30px;
}

.recap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

h3{
  margin: 0;
  @extend %font-heading-xs;
}

.recap.phone {
  margin: 0.5rem 0 1.5rem 0;

  h3 {
    @extend %font-bold-l;
  }
}

ul{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0;
  margin: 0;

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
  color: black;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.30);

  &.orange {
    background-color: $warning;
    color: white;
  }
  &.red {
    background-color: $danger;
    color: white;
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
</style>
