<template>
  <section>
    <HomeworkHeader
      :nb-homeworks-undone="nbHomeworksUndone"
      :undone-only="undoneOnly"
      @updateUndoneOnly="updateUndoneOnlyValue"
    />
    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="homeworkList.length === 0"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <ul
      v-else
      class="homework-list"
    >
      <li
        v-for="homework in homeworkList"
        :key="homework.homeworkId"
      >
        <HomeworkItem
          :homework="homework"
          @updateDoneStatus="homework.isDone = $event"
        />
      </li>
    </ul>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { getHomeworks } from '@/api/dashboard/homeworks.service'
import HomeworkItem from '@components/Dashboard/Homeworks/HomeworkItem.vue'
import HomeworkHeader from '@components/Dashboard/Homeworks/HomeworkHeader.vue'

export default {
  name: 'HomeworkWidget',
  components: { HomeworkHeader, HomeworkItem },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      error: false,
      undoneOnly: false,
      homeworkList: [],
      nbHomeworksUndone: 0
    }
  },
  watch: {
    userId () {
      this.getHomeworks()
    }
  },
  created () {
    this.getHomeworks()
  },
  methods: {
    updateUndoneOnlyValue (value) {
      this.undoneOnly = value
      this.getHomeworks()
    },
    getHomeworks () {
      this.isLoading = true
      getHomeworks(this.userId, dayjs().format('YYYY-MM-DD HH:mm'), this.undoneOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.homeworkList = data.homeworks
          // TODO this.nbHomeworksUndone = data.nbHomeworksUndone
        } else {
          this.error = true
          console.error('Error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  width: min(355px, 100vw);
  position: relative;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.placeholder {
  height: 106px;
}

</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun devoir à faire!!"
}
</i18n>
