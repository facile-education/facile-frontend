<template>
  <div>
    <div
      v-if="homeworks && homeworks.length === 0"
    >
      <p>{{ $t('no-homeworks') }}</p>
    </div>
    <div
      v-else
      class="homeworks"
    >
      <StudentHomework
        v-for="homework in sortedHomeworks"
        :key="homework.homeworkId"
        :homework="homework"
      />
    </div>
  </div>
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'
import { defineAsyncComponent } from 'vue'

import { getTeacherHomeworksToCorrect } from '@/api/homework.service'

const StudentHomework = defineAsyncComponent(() => import('@/components/Course/StudentHomework'))

export default {
  name: 'TeacherHomeworkTab',
  components: { StudentHomework },
  data () {
    return {
      homeworks: []
    }
  },
  computed: {
    sortedHomeworks () {
      return WeprodeUtils.sortArrayWithString(this.homeworks, false, 'targetDate')
    }
  },
  created () {
    getTeacherHomeworksToCorrect().then((data) => {
      if (data.success) {
        console.log(data)
        this.homeworks = data.homeworks
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

</style>

<i18n locale="fr">
{
  "no-homeworks": "Aucun devoir à corriger"
}
</i18n>
