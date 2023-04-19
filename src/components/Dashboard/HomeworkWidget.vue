<template>
  <Widget>
    <template #header>
      <span class="widget-header">
        <BaseIcon
          class="header-icon"
          name="newspaper"
        />
        {{ $t('homeworks') }}
      </span>
    </template>

    <template #default>
      <div
        v-for="homework in homeworks"
        :key="homework.homeworkId"
        class="homework"
      >
        <p>TODO: display homeworks</p>
      </div>
    </template>
  </Widget>
</template>

<script>
import dayjs from 'dayjs'
import { getStudentHomeworks } from '@/api/dashboard.service'
import BaseIcon from '@components/Base/BaseIcon'
import Widget from '@components/Dashboard/Widget'
export default {
  name: 'HomeworkWidget',
  components: { Widget, BaseIcon },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      homeworks: [],
      currentDate: dayjs()
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
    getHomeworks () {
      getStudentHomeworks(this.userId).then((data) => {
        if (data.success) {
          this.homeworks = data.homeworkList
        }
      }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
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
