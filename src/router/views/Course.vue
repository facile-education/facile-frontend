<template>
  <Layout :is-allowed="isTeacher || $store.state.user.isStudent || $store.state.user.isParent">
    <PentilaTabList v-if="isTeacher">
      <PentilaTabItem
        :title="$t('schedule')"
      >
        <ScheduleTab />
      </PentilaTabItem>
      <!--      <PentilaTabItem-->
      <!--        :title="$t('course')"-->
      <!--      >-->
      <!--        <CourseTab />-->
      <!--      </PentilaTabItem>-->
      <!--      <PentilaTabItem-->
      <!--        :title="$t('toCorrect')"-->
      <!--      >-->
      <!--        <TeacherHomeworkTab />-->
      <!--      </PentilaTabItem>-->
    </PentilaTabList>
    <PentilaTabList v-else>
      <PentilaTabItem
        :title="$t('homework') + ' ' + nbUndoneHomeworks"
      >
        <HomeworkTab />
      </PentilaTabItem>
      <PentilaTabItem
        :title="$t('course')"
      >
        <CourseTab />
      </PentilaTabItem>
    </PentilaTabList>
  </Layout>
</template>

<script>
import { getStudentUndoneCount } from '@/api/homework.service'
import CourseTab from '@/components/Course/CourseTab.vue'
import HomeworkTab from '@/components/Course/HomeworkTab.vue'
import ScheduleTab from '@/components/Course/ScheduleTab.vue'
// import TeacherHomeworkTab from '@/components/Course/TeacherHomeworkTab.vue'
import Layout from '@/router/layouts/BannerLayout'

export default {
  name: 'Course',
  components: {
    Layout,
    CourseTab,
    HomeworkTab,
    ScheduleTab
    // TeacherHomeworkTab
  },
  inject: ['mq'],
  data () {
    return {
      nbUndoneHomeworks: 0
    }
  },
  computed: {
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    studentId () {
      // TODO if parent
      return this.$store.state.user.userId
    }
  },
  created () {
    if (this.$store.state.user.isStudent || this.$store.state.user.isParent) {
      getStudentUndoneCount(this.studentId).then((data) => {
        if (data.success) {
          this.nbUndoneHomeworks = data.nbUndoneHomeworks
        }
      })
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import '@design';

.base-tab {
  color: $neutral-100;

  @extend %font-regular-l;

  &.active {
    @extend %font-bold-l;
  }
}
</style>

<style lang="scss" scoped>
</style>

<i18n locale="fr">
{
  "course": "Cours",
  "serviceTitle": "Cours & Devoirs",
  "schedule": "Horaires",
  "homework": "Travaux à faire",
  "toCorrect": "À corriger"
}
</i18n>
