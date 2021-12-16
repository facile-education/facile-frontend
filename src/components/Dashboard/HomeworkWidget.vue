<template>
  <div
    class="homework-widget"
  >
    <div
      class="header"
    >
      <span>{{ $t('homeworks') }}</span>
    </div>
    <div class="body">
      <h3>Homework widget</h3>
      <div
        v-for="homework in homeworks"
        :key="homework.homeworkId"
        class="homework"
      >
        <p>coucou devoir</p>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getStudentHomeworks } from '@/api/dashboard.service'
export default {
  name: 'HomeworkWidget',
  props: {
  },
  data () {
    return {
      homeworks: [],
      currentDate: dayjs()
    }
  },
  computed: {
  },
  created () {
    // TODO : manage parents watching their child's schedule
    getStudentHomeworks(this.$store.state.user.userId).then(
      (data) => {
        if (data.success) {
          this.homeworks = data.homeworkList
        }
      }
    )
  },
  methods: {
    formatDate (date) {
      return date.format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.homework-widget {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-height: 600px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  .header {
    margin: 0;
    padding: 10px 10px;
  }

  .body {
    padding: 10px 15px;
  }
}
</style>

<i18n locale="fr">
{
  "homeworks": "Devoirs"
}
</i18n>
