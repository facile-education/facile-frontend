<template>
  <div
    :class="classes"
    class="message"
    @click="selectMessage"
  >
    <div class="icons">
      <div>
        <i
          v-if="message.isNew"
          class="theme-text-color fa fa-circle"
        />
      </div>
      <div>
        <i
          v-if="message.hasAttachFiles"
          class="fa fa-paperclip"
        />
      </div>
    </div>
    <div class="informations">
      <div class="sender">
        {{ message.senderName }}
      </div>
      <div class="date">
        {{ message.sendDate }}
      </div>
      <div class="subject">
        {{ message.subject }}
      </div>
      <div class="content">
        {{ message.textContent }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageItem',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    classes () {
      return {
        selected: this.selected
      }
    },
    selected () {
      return (this.$store.state.messaging.selectedMessageList.indexOf(this.message) !== -1)
    }
  },
  methods: {
    selectMessage () {
      this.$store.dispatch('messaging/selectMessage', this.message)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.message {
  cursor: pointer;
  position: relative;

  &.selected {
    background-color: $selected-blue-background;
    color: $text-color-light;
  }
}

.icons {
  position: absolute;
  height: 78px;
  text-align: center;
  width: 19px;
  padding-top: 6px;

  div {
    height: 16px;
  }
}

.informations {
  margin-left: 20px;
  border-bottom: $border;
  height: 78px;
  padding-top: 6px;

  .sender {
    max-width: calc(100% - 109px);
    max-width: -webkit-calc(100% - 109px);
    max-width: -moz-calc(100% - 109px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .date {
    position: absolute;
    top: 6px;
    right: 0;
    color: #bfbfbf;
    width: 109px;
    font-size: 12px;
  }

  .subject {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content {
    position: relative;
    text-align: justify;
    max-height: 29px;
    line-height: 1.2;
    overflow: hidden;
    word-break: break-word;
    color: #bfbfbf;
  }
}
</style>
