<template>
  <div
    class="containerUserCardMain"
    :class="{'phone': mq.phone}"
    data-test="UserCardMain"
  >
    <UserPicture
      class="UserPicture"
      :user="userDetails"
      size="90px"
    />
    <div class="userInfos">
      <div class="globalInfos">
        <div
          class="name_buttonContact"
          :class="{'phone': mq.phone}"
        >
          <h2>{{ `${userDetails.firstName} ${userDetails.lastName}` }}</h2>
          <WeprodeButton
            class="contact-button"
            data-test="SendMessage"
            :class="{'phone': mq.phone}"
            :cls="''"
            :title="$t('contact')"
            @click="createNewMessage([{ type: 1, text: userDetails.lastName + ' ' + userDetails.firstName, userId: userToDisplay.userId }])"
          >
            <img
              class="contact-icon"
              src="@/assets/icons/messaging_sent.svg"
              :alt="$t('contact')"
            >
            <span v-t="'Contacter'" />
          </WeprodeButton>
        </div>
        <p>{{ role }}</p>
        <p v-if="!userDetails.isParent">
          {{ school }}
        </p>
        <p class="email">{{ userDetails.email }}</p>
      </div>
    </div>
  </div>
  <teleport to="body">
    <!-- Create message modal -->
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
  .containerUserCardMain{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 32px;
    &.phone{
      flex-direction: column;
    }
    .UserPicture{
        width: 90px;
        height: 90px;
        border-radius: 50%;
        overflow: hidden;
    }
    .userInfos{
        flex: 1;
        .globalInfos{
          .name_buttonContact{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            &.phone{
              flex-direction: column;
              margin-bottom: 16px;
            }
          }
            h2{
                @extend %font-heading-s;
                margin: 0;
                margin-bottom: 4px
            }
            .contact-button {
              margin-left: 1rem;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 1px solid var(--Neutral-60, #9E9E9E);
              padding: 6px 8px;
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
            p{
                @extend %font-medium-m;
                margin: 0;
            }
            .email{
              margin: 0;
              margin-top: 10px;
              @extend %font-regular-m
            }
        }
    }
  }
</style>

<i18n locale="fr">
  {
    "contact": "Contacter cet utilisateur",
    "relative": "Responsable légal",
    "studentLabel": "Élève de {volee}ème"
  }
</i18n>
