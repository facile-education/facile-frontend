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
      <HomeworkItem
        v-for="homework in homeworks"
        :key="homework.homeworkId"
        :homework="homework"
        @updateDoneStatus="homework.isDone = $event"
      />
    </template>
  </Widget>
</template>

<script>
import dayjs from 'dayjs'
import { getHomeworks } from '@/api/dashboard/homeworks.service'
import BaseIcon from '@components/Base/BaseIcon.vue'
import Widget from '@components/Dashboard/Widget.vue'
import HomeworkItem from '@components/Dashboard/Homeworks/HomeworkItem.vue'
export default {
  name: 'HomeworkWidget',
  components: { HomeworkItem, Widget, BaseIcon },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      homeworks: [],
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
    getHomeworks () {
      getHomeworks(this.userId, dayjs().format('YYYY-MM-DD HH:mm'), this.undoneOnly).then((data) => {
        if (data.success) {
          this.homeworks = data.homeworks
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
