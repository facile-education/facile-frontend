<template>
  <div
    class="containerClasses"
    data-test="UserCardClasses"
  >
    <UserCardListItem
      v-if="userDetails.classes"
      :items="userDetails.classes"
      :title="$t('assignment')"
    />
    <template v-if="userDetails.isTeacher">
      <div class="containerSubject">
        <h2>
          <span>{{ $t('discipline') }}</span>
        </h2>
        <p class="subjects">{{ userDetails.subjects }}</p>
      </div>
      <div class="containerSchools">
        <div class="schoolsInfos">
          <WeprodeTabList>
            <WeprodeTabItem
              :title="'Classes'"
            >
              <div v-for="(school, index) in userDetails.schools" :key="index">
                <UserCardListItem
                  :items="school.classes"
                  :title="school.schoolName"
                  class="schoolItem"
                >
                  <img
                    src="@/assets/icons/school.svg"
                    alt="school icon"
                  >
                </UserCardListItem>
                <UserCardListItem
                  v-if="school.doyenClasses"
                  :items="school.doyenClasses"
                  :title="''"
                  class="schoolItem"
                >
                  <h2 class="theme-text-color">{{ $t('doyenClassesLabel') }}:</h2>
                </UserCardListItem>
                <UserCardListItem
                  v-if="school.mainTeacherClasses"
                  :items="school.mainTeacherClasses"
                  :title="''"
                  class="schoolItem"
                >
                  <h2 class="theme-text-color">{{ $t('mainTeacherClassesLabel') }}:</h2>
                </UserCardListItem>
              </div>
            </WeprodeTabItem>
            <WeprodeTabItem
              :title="'Cours'"
              class="tab-item"
            >
              <UserCardListItem
                v-for="(school, index) in userDetails.schools" :key="index"
                :items="school.cours"
                :title="school.schoolName"
                class="schoolItem"
              >
                <img
                  src="@/assets/icons/school.svg"
                  alt="school icon"
                >
              </UserCardListItem>
            </WeprodeTabItem>
          </WeprodeTabList>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
import UserCardListItem from '@/components/UserCard/Classes/UserCardListItem.vue'

export default {
  name: 'UserCardClasses',
  components: {
    UserCardListItem,
    WeprodeTabItem,
    WeprodeTabList
  },
  props: {
    userDetails: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";
.containerClasses {
  margin-bottom: 32px;
  .containerSubject{
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
    }
  }
  .containerSchools{
    img{
      width: 16px;
      height: 16px;
    }
    .schoolsInfos{
      margin-top: 10px;
      .schoolItem{
        h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        @extend %font-medium-m;
        }
      }
    }
  }
}
</style>

<i18n locale="fr">
  {
    "assignment": "Affectation",
    "discipline": "Discipline",
    "mainTeacherClassesLabel": "Maître de classe de",
    "doyenClassesLabel": "Doyen de"
  }
</i18n>
