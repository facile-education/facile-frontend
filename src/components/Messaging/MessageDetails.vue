<template>
  <div class="details">
    <template v-if="message">
      <div>
        <div class="shortcut">
          <i class="far fa-star"/>
        </div>
        <div class="header">
          <p>{{ message.senderName }}</p>
          <span class="date">{{ message.sendDate }}</span>
          <p>TODO label Object : {{ message.subject }}</p>
          <p>TODO label at {{ message.receivers }} {{ message.toName }}</p>
        </div>
      </div>
      <div
        class="content"
        v-html="message.content"/>
      {{ message.hasAttachFiles }}
      TODO label attachments
    </template>
    <template v-else>
      <span>TODO label no selected message</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MessageDetails',
  computed: {
    message () {
      return this.$store.getters.getCurrentSelectedMessage
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.details {
  background-color: $background-white-color;
  flex: 5;
  min-width: 0;
  max-width: 60%;
  border-left: $border;
}

.shortcut {
  position: absolute;
  text-align: center;
  width: 20px;
  height: 75px;
  padding-top: 6px;
}

.header {
  border-bottom: $border;
  position: relative;
  padding: 6px;
  padding-left: 0;
  margin-left: 20px;

  p {
    margin: 0 0 5px 0;
  }

  .date {
    position: absolute;
    top: 6px;
    right: 6px;
  }
}

.content {
  padding: 5px;
  margin: 4px;
  overflow-y: auto;
}
</style>
