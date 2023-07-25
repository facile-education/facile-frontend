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
    <div v-else>
      <div
        v-if="childList.length > 1"
        class="first-line"
      >
        <PentilaDropdown
          v-model="selectedChild"
          :list="childList"
          :sort="false"
          display-field="fullName"
          class="child-selector"
          @update:model-value="unselectCourse"
        />
      </div>

      <PentilaTabList>
        <PentilaTabItem
          :title="$t('homework')"
        >
          <HomeworkTab :user-id="selectedUser.userId" />
        </PentilaTabItem>
        <PentilaTabItem
          :title="$t('course')"
        >
          <CourseTab :user-id="selectedUser.userId" />
        </PentilaTabItem>
      </PentilaTabList>
    </div>
  </Layout>
</template>

<script>
// import { getStudentUndoneCount } from '@/api/homework.service'
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
      selectedUser: undefined,
      nbUndoneHomeworks: 0
    }
  },
  computed: {
    childList () {
      return this.$store.state.user.children
    },
    selectedChild: {
      get () {
        return this.$store.state.user.selectedChild
      },
      set (child) {
        this.$store.commit('user/setSelectedChild', child)
        this.selectedUser = child
      }
    },
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    studentId () {
      // TODO if parent
      return this.$store.state.user.userId
    }
  },
  created () {
    // if (this.$store.state.user.isStudent || this.$store.state.user.isParent) {
    //   getStudentUndoneCount(this.studentId).then((data) => {
    //     if (data.success) {
    //       this.nbUndoneHomeworks = data.nbUndoneHomeworks
    //     }
    //   })
    // }

    // Assume childList is correctly loaded at this state
    if (this.childList.length > 0) {
      this.$store.commit('user/setSelectedChild', this.childList[0])
      this.selectedUser = this.selectedChild
    } else {
      this.selectedUser = this.$store.state.user
    }
  },
  methods: {
    unselectCourse () {
      this.$store.dispatch('course/setSelectedCourse', undefined)
    }
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
  "schedule": "Séances",
  "homework": "À faire",
  "toCorrect": "À corriger"
}
</i18n>
