<template>
  <div class="containerUserCardResponsability">
    <h2 v-if="userDetails.isStudent">
      <img
        src="@/assets/icons/legalGuardians.svg"
        alt="legalGuardians icon"
      >
      <span>{{ $t('relativeTitle') }} :</span>
    </h2>
    <div class="content">
      <template v-if="userDetails.parents && userDetails.parents.length > 0">
        <div
          v-for="parent in userDetails.parents"
          :key="parent.userId"
          class="legualGardiansContainer"
        >
          <UserCardContact
            :userInfos.="parent"
            @contact="createNewMessage([{ type: 1, text: parent.lastName + ' ' + parent.firstName, userId: parent.userId }])"
          />
        </div>
      </template>
      <template v-if="userDetails.children && userDetails.children.length > 0">
        <p class="childrenContainer">
          {{ $t('responsability') }}
          <span v-for="(child, index) in userDetails.children" :key="index">
            <a
              class="theme-text-color"
              @click="updateUserCardModal(child)"
            >
              {{ `${child.firstName} ${child.lastName}` }}
            </a>
            {{ `(${child.class})` }}
            <span v-if="index < userDetails.children.length - 1">, </span>
          </span>
        </p>
      </template>
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
import { defineAsyncComponent } from 'vue'

import UserCardContact from '@/components/UserCard/Responsability/UserCardContact.vue'
import messagingUtils from '@/utils/messaging.utils'

const CreateMessageModal = defineAsyncComponent(() => import('@components/Messaging/CreateMessageModal'))

export default {
  name: 'UserCardResponsability',
  components: { UserCardContact, CreateMessageModal },
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
    isCreateMessageModalDisplayed () {
      return this.$store.state.messaging.isCreateMessageModalDisplayed
    }
  },
  methods: {
    createNewMessage (recipientList) {
      this.isMessagingModalDisplayed = true
      messagingUtils.newMessage(recipientList)
    },
    closeModal () {
      this.isMessagingModalDisplayed = false
    },
    updateUserCardModal (user) {
      this.$store.dispatch('userCard/initUserCard', user)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@design";
.containerUserCardResponsability {
  margin-bottom: 32px;
    h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    margin-bottom: 24px;
    @extend %font-regular-l;
    }
    .content{
        .legualGardiansContainer{
            margin-bottom: 16px;
          h3{
            @extend %font-bold-s;
            text-transform: uppercase;
            margin: 0;
            font-size: 14px;
          }
          a{
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            text-decoration-line: underline;
            cursor: pointer;
          }
        }
        .childrenContainer{
          @extend %font-regular-m;
          margin: 0;
          a{
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            text-decoration-line: underline;
            cursor: pointer;
          }
        }
    }
}
</style>

<i18n locale="fr">
  {
    "relativeTitle": "Responsable(s) légal(aux) ",
    "responsability": "En responsabilité de "
  }
</i18n>
