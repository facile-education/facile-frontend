<template>
  <div class="container">
    <div
      class="homework-item"
      :style="'background-color: ' + homework.subjectColor + '; border-color: ' + homeWorkBorderColor"
    >
      <span
        v-if="!homework.isDone && !homework.isSent"
        class="pellet"
        :style="'background-color: ' + homework.subjectColor"
      />

      <PentilaSpinner v-if="isLoading" />

      <span class="transparent-part">
        <span class="left-section">
          <span class="subject"> {{ homework.subject }}</span>
          <span
            class="description"
            v-html="homework.description"
          />
        </span>
        <span
          v-if="homework.type===homeworksTypes.SIMPLE_INSTRUCTION"
          class="right-section done-status"
        >
          <span v-t="(isDoneSwitchStatus ? 'done' : 'todo')" />
          <PentilaToggleSwitch
            v-model="isDoneSwitchStatus"
            class="switch"
            @update:modelValue="toggleDoneStatus"
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

import { homeworksTypes } from '@/constants/dashboardConstants'
import { setHomeworkDoneStatus } from '@/api/dashboard/homeworks.service'
import BaseIcon from '@components/Base/BaseIcon.vue'
export default {
  name: 'HomeworkItem',
  components: { BaseIcon },
  props: {
    homework: {
      type: Object,
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
      return (this.homework.isDone || this.homework.isSent) ? ('#FFFFFFDD #FFFFFFDD #FFFFFFDD ' + this.homework.subjectColor) : this.homework.subjectColor
    }
  },
  methods: {
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

.container {
  padding-right: 4px;
  padding-top: 4px;
  height: 50px;
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
  border-radius: 3px;
  overflow: visible;
}

.transparent-part {
  height: 100%;
  width: 100%;
  background-color: #FFFFFFDD;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.pellet {
  @extend %item-pellet;
}

.left-section {
  display: block;
  overflow: hidden;
}

.right-section {
  margin-left: 1rem;
}

.subject {
  display: block;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  ::v-deep(p) {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.done-status {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 0.8rem;

  .switch {
    margin-left: 0.5rem;
  }
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
