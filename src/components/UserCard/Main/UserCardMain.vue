<template>
  <section
    class="container-userCard-main"
    :class="{'phone': mq.phone}"
    data-test="UserCardMain"
  >
    <UserPicture
      class="user-picture"
      :user="userDetails"
      size="90px"
    />
    <div class="user-infos">
      <div class="global-infos">
        <div
          class="container-name_button-contact"
          :class="{'phone': mq.phone}"
        >
          <h2>{{ `${userDetails.firstName} ${userDetails.lastName}` }}</h2>
          <WeprodeButton
            class="contact-button"
            data-test="SendMessage"
            :class="{'phone': mq.phone}"
            :cls="''"
            :title="$t('contact')"
            @click="createNewMessage([{ type: 1, text: userDetails.lastName + ' ' + userDetails.firstName, userId: userDetails.userId }])"
          >
            <img
              class="contact-icon"
              src="@/assets/icons/messaging_sent.svg"
              :alt="$t('contact')"
            >
            <span v-t="'Contacter'" />
          </WeprodeButton>
        </div>
        <p class="role">
          {{ role }}
        </p>
        <p v-if="!userDetails.isParent">
          {{ school }} - {{ userDetails.isStudent && userDetails.class }}
        </p>
        <p class="email">
          {{ userDetails.email }}
        </p>
        <p
          v-if="userDetails.mobilePhone"
          class="mainPhone"
        >
          {{ userDetails.mobilePhone }} (perso)
        </p>
        <p
          v-if="userDetails.proPhone"
          class="mainPhone"
        >
          {{ userDetails.proPhone }} (pro)
        </p>
        <p
          v-if="userDetails.homePhone"
          class="mainPhone"
        >
          {{ userDetails.homePhone }} {{ `(${$t('homePhone')})` }}
        </p>
      </div>
    </div>
  </section>
  <teleport to="body">
    <CreateMessageModal
      v-if="isCreateMessageModalDisplayed && isMessagingModalDisplayed"
      @close="closeModal"
    />
  </teleport>
</template>

<script>
import UserPicture from '@components/Base/UserPicture.vue'
import { defineAsyncComponent } from 'vue'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import messagingUtils from '@/utils/messaging.utils'
const CreateMessageModal = defineAsyncComponent(() => import('@components/Messaging/CreateMessageModal'))
export default {
  name: 'UserCardMain',
  components: { UserPicture, WeprodeButton, CreateMessageModal },
  inject: ['mq'],
  props: {
    userDetails: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isMessagingModalDisplayed: false
    }
  },
  computed: {
    role () {
      if (this.userDetails.isParent) {
        return this.$t('relative')
      } else if (this.userDetails.isPersonal || this.userDetails.isTeacher) {
        return this.userDetails.roles
      } else {
        return this.$t('studentLabel', { volee: this.userDetails.volee })
      }
    },
    school () {
      if (this.userDetails.schools && this.userDetails.schools.length > 0) {
        return this.userDetails.schools.map(school => school.schoolName).join(' - ')
      } else {
        return this.userDetails.schoolName
      }
    },
    isCreateMessageModalDisplayed () {
      return this.$store.state.messaging.isCreateMessageModalDisplayed
    },
    userToDisplay () {
      return this.$store.state.userCard.userToDisplay
    }
  },
  methods: {
    createNewMessage (recipientList) {
      this.isMessagingModalDisplayed = true
      messagingUtils.newMessage(recipientList)
    },
    closeModal () {
      this.isMessagingModalDisplayed = false
    }
  }
}
</script>

<style lang="scss" scoped>

@import "@design";
.container-userCard-main{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
  &.phone{
    flex-direction: column;
  }
}
.user-picture{
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
}
.user-infos{
  flex: 1;
}

.global-infos{
  h2{
    @extend %font-heading-s;
    margin: 0;
    margin-bottom: 4px
  }
  p{
    @extend %font-medium-m;
    margin: 0;
  }
  .email{
    margin: 0;
    margin-top: 10px;
    @extend %font-regular-m;
  }
  .mainPhone{
    margin: 0;
    @extend %font-regular-m;
  }
}
.container-name_button-contact{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  &.phone{
    flex-direction: column;
    margin-bottom: 16px;
  }
  .contact-button {
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid $neutral-60;
  padding: 6px 8px;
  background-color: #FFF;
  &.phone{
    margin-left: 0;
    margin-top: 10px;
  }
  span {
    margin: 0 8px;
    @extend %font-regular-m
  }
  .contact-icon {
    width: 15px;
    height: 15px;
  }
}
}
</style>

<i18n locale="fr">
  {
    "contact": "Contacter cet utilisateur",
    "relative": "Responsable légal",
    "studentLabel": "Élève de {volee}ème",
    "homePhone": "maison"
  }
</i18n>
