<template>
  <section>
    <HomeworkHeader
      :nb-homeworks-undone="nbHomeworksUndone"
      :undone-only="undoneOnly"
      @updateUndoneOnly="updateUndoneOnlyValue"
    />
    <HomeworkItem
      v-for="homework in homeworks"
      :key="homework.homeworkId"
      :homework="homework"
      @updateDoneStatus="homework.isDone = $event"
    />
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
      homeworks: [],
      nbHomeworksUndone: 0,
      undoneOnly: false
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
      getHomeworks(this.userId, dayjs().format('YYYY-MM-DD HH:mm'), this.undoneOnly).then((data) => {
        if (data.success) {
          this.homeworks = data.homeworks
          // TODO this.nbHomeworksUndone = data.nbHomeworksUndone
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.widget-header {
  display: flex;
  align-items: center;

  .header-icon {
    font-size: 1.5rem;
    margin-right: 10px;
  }
}
</style>

<i18n locale="fr">
{
  "homeworks": "Devoirs"
}
</i18n>
