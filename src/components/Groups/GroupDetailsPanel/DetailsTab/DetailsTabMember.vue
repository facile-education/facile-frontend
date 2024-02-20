<template>
  <div
    class="member"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <span class="member-name"> {{ member.lastName }} {{ member.firstName }}</span>
    <img
      v-if="isHovering"
      data-test="send-message"
      src="@assets/icons/message2.svg"
      :alt="$t('Groups.DetailsTabMember.send-message')"
      :title="$t('Groups.DetailsTabMember.send-message')"
      @click="openCreateMessageModal"
    >
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
import messagingUtils from '@utils/messaging.utils'
import { defineAsyncComponent } from 'vue'
const CreateMessageModal = defineAsyncComponent(() => import('@components/Messaging/CreateMessageModal'))

export default {
  name: 'DetailsTabMember',
  components: { CreateMessageModal },
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isHovering: false,
      isMessagingModalDisplayed: false
    }
  },
  computed: {
    isCreateMessageModalDisplayed () {
      return this.$store.state.messaging.isCreateMessageModalDisplayed
    }
  },
  methods: {
    openCreateMessageModal () {
      this.isMessagingModalDisplayed = true
      messagingUtils.newMessage([{ type: 1, text: this.member.lastName + ' ' + this.member.firstName, userId: this.member.userId }])
    },
    closeModal () {
      this.isMessagingModalDisplayed = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.member{
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: $color-hover-bg;
  }
  img {
    height: 30px;
    cursor: pointer;
    margin-right: 10px;
  }
}

</style>
