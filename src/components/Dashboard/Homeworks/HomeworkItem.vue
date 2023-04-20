<template>
  <div
    class="homework-item"
    :style="'background-color: ' + homework.subjectColor + '; border-color: ' + homework.subjectColor"
  >
    <PentilaSpinner v-if="isLoading" />
    <span class="left-section">
      <span class="subject"> {{ homework.subject }}</span>
      <span
        class="description"
        v-html="homework.description"
      />
    </span>
    <PentilaToggleSwitch
      v-if="homework.type===homeworksTypes.SIMPLE_INSTRUCTION"
      v-model="isDoneSwitchStatus"
      :title="isDoneSwitchStatus ? $t('done') : $t('todo')"
      :label="isDoneSwitchStatus ? $t('done') : $t('todo')"
      @update:modelValue="toggleDoneStatus"
    />
    <span v-else-if="homework.isSent">
      {{ $t('returned') }}
      <BaseIcon
        class="paper-clip"
        name="paperclip"
      />
    </span>
    <span
      v-else
      v-t="'toReturn'"
    />
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
  data () {
    return {
      isLoading: false,
      isDoneSwitchStatus: this.homework.isDone
    }
  },
  computed: {
    homeworksTypes () {
      return homeworksTypes
    }
  },
  methods: {
    toggleDoneStatus () {
      this.isLoading = true
      setHomeworkDoneStatus(this.homework.homeworkId, this.isDoneSwitchStatus).then((data) => {
        this.isLoading = false
        if (!data.success) {
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
.homework-item {
  height: 50px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-left: 4px solid;
}

.left-section {
  display: block;
}

.subject {
  font-size: 0.8rem;
}

.description {
  ::v-deep(p) {
    margin: 0;
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
