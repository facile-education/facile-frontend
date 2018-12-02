<template>
  <div>
    <MessagingToolbar/>
    <div class="messaging-body">
      <MessagingMenu class="body-height"/>
      <MessageList class="body-height"/>
      <MessageDetails class="body-height"/>
    </div>
  </div>
</template>

<script>
import MessagingToolbar from '@/components/Messaging/MessagingToolbar'
import MessagingMenu from '@/components/Messaging/MessagingMenu'
import MessageList from '@/components/Messaging/MessageList'
import MessageDetails from '@/components/Messaging/MessageDetails'

export default {
  name: 'Messaging',
  components: {
    MessagingToolbar,
    MessagingMenu,
    MessageList,
    MessageDetails
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.messaging-body {
  display: flex;
  height: 100%;
}

.body-height {
  height: 100%;
  overflow-y: auto;
}
</style>
