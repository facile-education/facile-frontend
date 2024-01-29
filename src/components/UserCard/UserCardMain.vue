<template>
  <div class="containerUserCardMain">
    <UserPicture
      class="UserPicture"
      :user="userDetails"
    />
    <div class="userInfos">
      <div class="globalInfos">
        <h2>{{ `${userDetails.firstName} ${userDetails.lastName}` }}</h2>
        <p v-if="!userDetails.isParent">{{ role }}</p>
        <p v-if="userDetails.isStudent">{{ `${userDetails.schoolName} ${userDetails.class}` }}</p>
        <p v-else>{{ userDetails.schools[0].schoolName }}</p>
      </div>
      <div class="contactInfos">
        <div class="left">
          <p>{{ `${userDetails.email}` }}</p>
          <p>0709561289</p>
        </div>
        <div class="right"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCardMain',
  props: {
    userDetails: {
      type: Object,
      required: true
    }
  },
  computed: {
    role () {
      if (this.userDetails.isParent) {
        return 'Responsable légal'
      } else if (this.userDetails.isPersonal || this.userDetails.isTeacher) {
        return this.userDetails.roles
      } else {
        return `Élève de ${this.userDetails.volee}`
      }
    }
  }

}
</script>

<style lang="scss" scoped>

@import "@design";
  .containerUserCardMain{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    height: 90px;
    .UserPicture{
        width: 90px;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
    }
    .userInfos{
        flex: 1;
        height: 100%;
        .globalInfos{
            h2{
                @extend %font-heading-s;
                margin: 0;
                margin-bottom: 4px
            }
            p{
                @extend %font-medium-m;
                margin: 0;
            }
        }
        .contactInfos{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
  }
</style>
