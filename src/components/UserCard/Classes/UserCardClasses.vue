<template>
  <section
    class="container-classes"
    data-test="UserCardClasses"
  >
    <UserCardList
      v-if="userDetails.classes"
      data-test="assignment"
      :items="userDetails.classes"
      :title="$t('UserCard.UserCardClasses.assignment')"
    />
    <template v-if="userDetails.isTeacher">
      <div
        class="container-subject"
        data-test="containerSubject"
      >
        <h2>
          <span>{{ $tc('UserCard.UserCardClasses.discipline', userDetails.subjects.length) }}</span>
        </h2>
        <p class="subjects">
          {{ subject }}
        </p>
      </div>
      <div class="container-schools">
        <div class="schools-infos">
          <WeprodeTabList>
            <WeprodeTabItem
              data-test="classesTab"
              :title="'Classes'"
            >
              <div
                v-for="(school, index) in userDetails.schools"
                :key="index"
                data-test="schoolContainer"
              >
                <UserCardList
                  :items="school.classes"
                  :title="school.schoolName"
                  class="school-item"
                  data-test="schoolClasses"
                >
                  <img
                    src="@/assets/icons/school.svg"
                    alt="school icon"
                  >
                </UserCardList>
                <UserCardList
                  v-if="school.doyenClasses"
                  :items="school.doyenClasses"
                  :title="''"
                  class="school-item"
                  data-test="doyenClasses"
                >
                  <h2 class="theme-text-color">
                    {{ $t('UserCard.UserCardClasses.doyenClassesLabel') }}:
                  </h2>
                </UserCardList>
                <UserCardList
                  v-if="school.mainTeacherClasses"
                  :items="school.mainTeacherClasses"
                  :title="''"
                  class="school-item"
                  data-test="mainTeacherClasses"
                >
                  <h2 class="theme-text-color">
                    {{ $t('UserCard.UserCardClasses.mainTeacherClassesLabel') }}:
                  </h2>
                </UserCardList>
              </div>
            </WeprodeTabItem>
            <WeprodeTabItem
              :title="'Cours'"
              data-test="coursesTab"
            >
              <UserCardList
                v-for="(school, index) in userDetails.schools"
                :key="index"
                :items="school.cours"
                :title="school.schoolName"
                class="school-item"
                data-test="schoolCourses"
              >
                <img
                  src="@/assets/icons/school.svg"
                  alt="school icon"
                >
              </UserCardList>
            </WeprodeTabItem>
          </WeprodeTabList>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
import UserCardList from '@/components/UserCard/Classes/UserCardList.vue'

export default {
  name: 'UserCardClasses',
  components: {
    UserCardList,
    WeprodeTabItem,
    WeprodeTabList
  },
  props: {
    userDetails: {
      type: Object,
      required: true
    }
  },
  computed: {
    subject () {
      return this.userDetails.subjects.join(', ')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";
.container-classes {
  margin-bottom: 32px;
}
.container-subject{
  margin-bottom: 16px;
  h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  margin-bottom: 5px;
  @extend %font-regular-l;
  img{
    width: 16px;
    height: 16px;
  }
  }
  p{
    @extend %font-regular-m;
    margin: 0;
    margin-left: 16px;
  }
}
.container-schools{
  img{
    width: 16px;
    height: 16px;
  }
}
.schools-infos{
  margin-top: 10px;
  .school-item{
    h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    @extend %font-medium-m;
    }
  }
}
</style>
