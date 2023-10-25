<template>
  <div class="homework-container">
    <div
      class="homework-item"
      :class="{'done': homework.isDone || homework.isSent}"
      :style="(!homework.isDone && !homework.isSent) ? ('background-color: ' + homework.color + '; border-color: ' + homeWorkBorderColor) : ''"
      :tabindex="0"
      :title="homework.title"
      @keyup.enter="redirect"
      @click="redirect"
    >
      <span
        v-if="!homework.isDone && !homework.isSent"
        class="pellet"
        :style="'background-color: ' + homework.color"
      />

      <WeprodeSpinner v-if="isLoading" />

      <span
        class="transparent-part"
        :class="{'undone': !homework.isDone && !homework.isSent}"
      >
        <span class="left">
          <span class="first-line">{{ homework.subject }} · {{ teacherName }} · {{ 'P' + homework.targetSlotNumber }}</span>
          <strong class="title">{{ homework.title }}</strong>
          <span class="description">{{ description }}</span>
        </span>

        <span
          v-if="homework.type===homeworksTypes.SIMPLE_INSTRUCTION"
          class="right-section"
        >
          <WeprodeCheckbox
            v-if="canUpdateStatus"
            v-model="isDoneSwitchStatus"
            :label="homework.isDone ? $t('done') : $t('todo')"
            :right-display="true"
            @update:model-value="toggleDoneStatus"
            @click.stop
            @keyup.enter.stop
          />
          <span
            v-else
            v-t="homework.isDone ? 'done' : 'todo'"
          />
        </span>

        <span
          v-else-if="homework.isSent"
          class="right-section"
        >
          {{ $t('returned') }}
          <BaseIcon
            class="paper-clip"
            name="paperclip"
          />
        </span>
        <span
          v-else
          v-t="'toReturn'"
          class="right-section"
        />
      </span>
    </div>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'
import { getHomeworkTeacherName } from '@utils/commons.util'
import dayjs from 'dayjs'

import { setHomeworkDoneStatus } from '@/api/homework.service'
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { CDT } from '@/constants/appConstants'
import { homeworksTypes } from '@/constants/dashboardConstants'
export default {
  name: 'HomeworkItem',
  components: { BaseIcon, WeprodeCheckbox, WeprodeSpinner },
  props: {
    homework: {
      type: Object,
      required: true
    },
    canUpdateStatus: {
      type: Boolean,
      required: true
    }
  },
  emits: ['updateDoneStatus'],
  data () {
    return {
      isLoading: false,
      isDoneSwitchStatus: this.homework.isDone
    }
  },
  computed: {
    homeworksTypes () {
      return homeworksTypes
    },
    homeWorkBorderColor () {
      return (this.homework.isDone || this.homework.isSent) ? ('#FFFFFFDD #FFFFFFDD #FFFFFFDD ' + this.homework.color) : this.homework.color
    },
    teacherName () {
      return getHomeworkTeacherName(this.homework)
    },
    description () {
      return this.homework.shortContent
    }
  },
  methods: {
    redirect () {
      this.$router.push({
        name: CDT,
        query: {
          homeworkId: this.homework.homeworkId,
          toDate: dayjs(this.homework.toDate, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
        }
      })
    },
    toggleDoneStatus () {
      this.isLoading = true
      setHomeworkDoneStatus(this.homework.homeworkId, this.isDoneSwitchStatus).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.$emit('updateDoneStatus', this.isDoneSwitchStatus)
        } else {
          console.error('Error on setting homework status')
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          this.isDoneSwitchStatus = !this.isDoneSwitchStatus // Reset initial switch state
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
  text-align: left;
}

.homework-container {
  padding-right: 4px;
  padding-top: 4px;
  width: 100%;
}

.homework-item {
  height: 100%;
  width: 100%;
  position: relative;
  border-top: 1px solid;
  border-right: 1px solid;
  border-bottom: 1px solid;
  border-left: 5px solid;
  border-radius: 6px;
  overflow: visible;
  cursor: pointer;

  &.done {
    border-left: 1px solid;
    border-color: $neutral-40;
  }
}

.transparent-part {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  padding: 0.5rem 1rem 0.5rem calc(1rem + 4px);

  &.undone {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    background-color: #FFFFFFDD;
    padding: 0.5rem 1rem;
  }
}

.pellet {
  @extend %item-pellet;
}

.left {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.right-section {
  margin-left: 1rem;
  white-space: nowrap;
  font-size: 0.8rem;
}

.first-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @extend %font-regular-xs;
}

.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @extend %font-bold-l;
}

.description {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @extend %font-regular-s;
}

.paper-clip {
  margin-left: 0.5rem;
}

</style>

<i18n locale="fr">
{
  "done": "Fait",
  "todo": "À faire",
  "returned": "Rendu",
  "toReturn": "À rendre"
}
</i18n>
