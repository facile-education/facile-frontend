<template>
  <div
    class="splitarea-header"
    :class="{'phone': mq.phone || mq.tablet}"
    data-test="header"
  >
    <div class="header-label">
      <div
        v-if="mq.phone || mq.tablet"
        class="open-menu"
        @click="toggleSideMenuPanel"
      >
        <img
          :src="require('@assets/arrow_right.svg')"
          alt="open menu"
        >
        <div v-t="'Messaging.boxes'" />
      </div>
      <div
        class="current-folder"
        :title="currentFolder && currentFolder.type === 5 ? currentFolderName : ''"
      >
        <p>{{ formattedCurrentFolderName }}</p>
        <div class="counts">
          <span
            v-if="isReadOnlyToggled"
            class="nb-messages"
          >{{ $t('filterByUnread') }}</span>
          <span
            v-else
            class="nb-messages"
          >{{ $tc('messages', nbMessages) }}</span>
          <div
            v-if="nbUnread>0"
            class="unread theme-background-color"
          />
          <span
            v-if="nbUnread>0"
            class="nb-unread theme-text-color"
          >{{ $tc('unRead', nbUnread) }}</span>
        </div>
      </div>

      <img
        v-if="(mq.phone || mq.tablet) && isThreadsDisplayed"
        class="toggle-multi-selection"
        src="@assets/icon_list.svg"
        alt="toggle multi-selection"
        @click="toggleMultiSelection"
      >
    </div>

    <ThreadListOptions v-if="!mq.phone && !mq.tablet" />
  </div>
</template>

<script>
import ThreadListOptions from '@components/Messaging/ThreadListOptions'

export default {
  name: 'ThreadListHeader',
  components: { ThreadListOptions },
  inject: ['mq'],
  data () {
    return {
      unreadOnly: false,
      isMarkerSelectionDisplayed: false
    }
  },
  computed: {
    isThreadsDisplayed () {
      return this.$store.state.messaging.threads.length > 0
    },
    isMultiSelectionActive () {
      return this.$store.state.messaging.isMultiSelectionActive
    },
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    },
    selectedThreads () {
      return this.$store.state.messaging.selectedThreads
    },
    isMenuPanelDisplayed () {
      return this.$store.state.messaging.isMenuPanelDisplayed
    },
    currentFolderName () {
      return this.$store.state.messaging.currentFolder.folderName
    },
    currentFolder () {
      return this.$store.state.messaging.currentFolder
    },
    formattedCurrentFolderName () {
      return this.currentFolderName ? this.currentFolderName.toUpperCase() : ''
    },
    nbUnread () {
      return this.$store.state.messaging.currentFolder.nbUnread
    },
    nbMessages () {
      return this.$store.state.messaging.currentFolder.nbMessages
    },
    themeColor () {
      return this.$store.state.user.themeColor
    },
    isReadOnlyToggled () {
      return this.$store.state.messaging.unreadOnly
    }
  },
  methods: {
    toggleSideMenuPanel () {
      this.$store.dispatch('messaging/toggleSideMenuPanel')
    },
    toggleMultiSelection () {
      this.$store.dispatch('messaging/toggleMultiSelection')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.splitarea-header {
  padding: 0 1% 0 3.8%;
  height: $messaging-header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-label {
    display: flex;
    align-items: center;

    img {
      width: 33px;
      margin-right: 15px;
    }
    .current-folder {
      height: $messaging-header-height;
      display: flex;
      flex-direction: column;
      font-weight: bold;
      justify-content: center;

      .counts {
        display: flex;
        align-items: center;
        .nb-messages {
          color: $color-new-light-text;
          font-weight: normal;
          font-size: 0.875em;
          margin-right: 10px;
        }
        .unread {
          margin-left: 5px;
          @extend %messaging-pellet;
        }
        .nb-unread {
          font-size: 0.875em;
          margin-left: 5px;
        }
      }
      p {
        max-width: 170px; /* TODO find solution to mix that with flex: justify-content:space-between */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
      }
    }
  }

  &.phone {
    display: block;
    padding: 0 20px;
    height: $messaging-mobile-header-height;

    .header-label {
      justify-content: space-between;
      position: relative;
      height: 60px;

      .open-menu {
        display: flex;
        align-items: center;

        img {
          transform: rotate(180deg);
          height: 14px;
          width: 14px;
          margin: 0 5px 0 0;
        }
      }

      .current-folder {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
      }

      .toggle-multi-selection {
        cursor: pointer;
        width: 16px;
        height: 16px;
        margin: 0;
      }
    }
  }
}

</style>

<i18n locale="fr">
{
  "unRead": "0 non lu | 1 non lu | {count} non lus",
  "messages": "Aucun message | 1 message | {count} messages",
  "filterByUnread": "Filtré par non lus"
}
</i18n>
