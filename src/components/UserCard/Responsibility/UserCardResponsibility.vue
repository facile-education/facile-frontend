<template>
  <section
    class="container-userCard-responsibility"
    data-test="UserCardResponsibility"
  >
    <h2 v-if="userDetails.isStudent">
      <CustomIcon
        class="legalGuardians-icon"
        :icon-name="'icon-collab-workspace'"
      />
      <span>{{ $t('relativeTitle') }}</span>
    </h2>
    <div class="content">
      <template v-if="userDetails.parents && userDetails.parents.length > 0">
        <div
          v-for="parent in userDetails.parents"
          :key="parent.userId"
          class="legalGuardians-container"
        >
          <UserCardContact
            :user-infos="parent"
            @contact="createNewMessage([{ type: 1, text: parent.lastName + ' ' + parent.firstName, userId: parent.userId }])"
          />
        </div>
      </template>
      <template v-if="userDetails.children && userDetails.children.length > 0">
        <p class="children-container">
          {{ $t('responsibility') }}
          <span
            v-for="(child, index) in userDetails.children"
            :key="index"
          >
            <span
              class="theme-text-color toggle-user-card"
              @click="updateUserCardModal(child)"
            >
              {{ `${child.firstName} ${child.lastName}` }}
            </span>
            {{ `(${child.class})` }}
            <span v-if="index < userDetails.children.length - 1">, </span>
          </span>
        </p>
      </template>
    </div>
  </section>
  <teleport to="body">
    <CreateMessageModal
      v-if="isMessagingModalDisplayed"
      @close="closeModal"
    />
  </teleport>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import UserCardContact from '@/components/UserCard/Responsibility/UserCardContact.vue'
import messagingUtils from '@/utils/messaging.utils'

const CustomIcon = defineAsyncComponent(() => import('@components/Base/CustomIcon.vue'))
const CreateMessageModal = defineAsyncComponent(() => import('@components/Messaging/CreateMessageModal'))

export default {
  name: 'UserCardResponsibility',
  components: { UserCardContact, CreateMessageModal, CustomIcon },
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
.container-userCard-responsibility {
  margin-bottom: 32px;

  h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  margin-bottom: 8px;
  @extend %font-regular-l;
  }
  .legalGuardians-icon{
    font-size: 1.5rem;
  }
}
.content {
  padding: 16px 0;
  border-radius: 6px;
  background-color: $neutral-20;
}
.legalGuardians-container{
  margin-bottom: 16px;
  margin-left: 16px;

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
.children-container{
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
</style>

<i18n locale="fr">
  {
    "relativeTitle": "Responsable(s) légal(aux) ",
    "responsibility": "En responsabilité de "
  }
</i18n>
