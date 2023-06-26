<template>
  <div class="main">
    <p>dfdf</p>
    <div
      v-if="homeworkList && homeworkList.length === 0"
      class="main-label"
    >
      <p>{{ $t('no-homeworks') }}</p>
    </div>
    <div
      v-else
      class="homeworks"
    >
      <Homework
        v-for="homework in sortedHomeworks"
        :key="homework"
      >
        <p>devoir</p>
      </homework>
    </div>
  </div>
</template>

<script>
import PentilaUtils from 'pentila-utils'

import { getTeacherHomeworksToCorrect } from '@/api/homework.service'

export default {
  name: 'TeacherHomeworkTab',
  components: {},
  data () {
    return {
      homeworks: []
    }
  },
  computed: {
    sortedHomeworks () {
      return PentilaUtils.Array.sortWithString(this.homeworks, false, 'targetDate')
    }
  },
  created () {
    getTeacherHomeworksToCorrect().then((data) => {
      if (data.success) {
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

.main-label {
  margin-top: 10em;
  text-align: center;
}
</style>

<i18n locale="fr">
{
}
</i18n>
