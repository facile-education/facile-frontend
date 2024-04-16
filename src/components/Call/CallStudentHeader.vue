<template>
  <div>
    <div class="first-line">
      <a
        href="#"
        style="color: black;"
        class="toggle-user-card"
        @click="openUserCardModal"
      >
        {{ getFullName(student) }}
      </a>
      <div
        v-if="student.memo?.length > 0 || student.nbUnjustified > 0"
        class="student-data"
      >
        <button
          v-if="student.memo?.length > 0"
          class="memo"
          :title="student.memo"
          :aria-label="student.memo"
          @click.stop="displayMemo = !displayMemo"
        >
          <CustomIcon icon-name="icon-info" />
          <WeprodeTooltip
            v-if="displayMemo"
            class="memo-tooltip"
            :header="$t('Call.memo')"
            @click.stop
            @close="displayMemo = false"
          >
            {{ student.memo }}
          </WeprodeTooltip>
        </button>
        <button
          v-if="student.nbUnjustified > 0"
          class="nb-unjustified"
          :title="$tc('Call.toJustify', {n: student.nbUnjustified})"
          :aria-label="$tc('Call.toJustify', {n: student.nbUnjustified})"
          @click.stop="displayNbUnjustified = !displayNbUnjustified"
        >
          <CustomIcon icon-name="icon-warning" />
          <Pellet
            v-if="student.nbUnjustified > 1"
            :count="student.nbUnjustified"
            :show-count="true"
            class="pellet"
          />
          <WeprodeTooltip
            v-if="displayNbUnjustified"
            class="unjustified-tooltip"
            :header="$t('Call.schoolLife')"
            @click.stop
            @close="displayNbUnjustified = false"
          >
            {{ $tc('Call.toJustify', {n: student.nbUnjustified}) }}
          </WeprodeTooltip>
        </button>
      </div>
    </div>
    <div
      v-if="student.isAbsentOnPreviousSession || student.isExpectedAbsent"
      class="student-absence"
    >
      <div class="absence-icon-container">
        <CustomIcon icon-name="icon-no-user" />
      </div>
      <span>
        {{ $t(student.isExpectedAbsent ? 'Call.expectedAbsent' : 'Call.absentOnPreviousSession') }}
      </span>
    </div>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import Pellet from '@components/Base/Pellet.vue'
import WeprodeTooltip from '@components/Base/Weprode/WeprodeTooltip.vue'

import { getFullName } from '@/utils/commons.util.js'

export default {
  name: 'CallStudentHeader',
  components: { WeprodeTooltip, Pellet, CustomIcon },
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      displayMemo: false,
      displayNbUnjustified: false
    }
  },
  methods: {
    getFullName,
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', this.student)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.first-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 32px;
}

.student-data {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

a {
  white-space: nowrap;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.memo {
  position: relative;
}

.nb-unjustified {
  position: relative;
  display: flex;
  align-items: center;

  .pellet {
    position: absolute;
    top: -5px;
    right: -8px;
  }
}

.icon-info {
  color: $info;
}

.student-absence {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    @extend %font-regular-xs;
  }
}

.absence-icon-container {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.30);
  background-color: $danger;
}

.memo-tooltip, .unjustified-tooltip {
  top: 100%;
  left: 0;
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

</style>
