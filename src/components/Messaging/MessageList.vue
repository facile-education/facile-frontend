<template>
  <div
    v-if="messageList"
    class="list"
  >
    <MessageItem
      v-for="message in messageList"
      :key="message.messageId"
      :message="message"
    />
  </div>
</template>

<script>
import MessageItem from '@/components/Messaging/MessageItem'

export default {
  name: 'MessagingMessageList',
  components: {
    MessageItem
  },
  computed: {
    messageList () {
      return this.$store.state.messaging.messageList
    }
  },
  created () {
    if (this.messageList === undefined) {
      this.$store.dispatch('messaging/initMessageList')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.list {
  background-color: $background-white-color;
  flex: 3;
  min-width: 0;
}
</style>
