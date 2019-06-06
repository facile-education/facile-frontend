<template>
  <div class="attachment">
    <span
      :class="{'viewable': isViewable}"
      @click="displayAttachment()"
    >
      <i
        :class="{'fa-paperclip': attachment.type == 'attachFile', 'fa-microphone': attachment.type == 'audioFile', 'fa-book': attachment.isEDXAssignement}"
        class="theme-color fa"
      />
      {{ attachment.name }}
    </span>

    <!-- Attachment context menu -->
    <a
      class="context-menu-toggle"
      @click.stop="toggleContextMenu"
    >
      <i class="fa fa-ellipsis-v" />
    </a>

    <PentilaAutocomplete
      v-if="displayActionList"
      :list="actionList"
      :sort="false"
      display-field="label"
      class="context-menu"
      @select="runActionCallback"
      @close="toggleContextMenu"
    />

  <!--div
    class="tree-popup nero-shadow"
    ng-if="showTree"
  >
    <div class="tree-popup-header theme-backgroundcolor">
      <p>TODO Espace de travail</p>

      <button
        type="button"
        class="nero-close-modal"
        ng-click="hideTree()"
      >
        <i class="i-nero-close" />
      </button>
    </div>
    <document-tree-directive
      folders-only="true"
      schoolbag-only="true"
      move-entry="onMoveAttachment(entry, targetFolder)">
    </document-tree-directive>

    <button
      type="button"
      class="nero-button theme-backgroundcolor add-to-workspace-btn"
      ng-click="AttachmentItemCtrl.addAttachmentToSelectedFolder()"
      ng-show="AttachmentItemCtrl.showAddButton">
      TODO Valider
    </button>
    <i class="fa fa-caret-down tree-popup-caret" /-->
  </div>
</template>

<script>
import NeroUtils from '@/utils/nero.utils'

export default {
  name: 'NeroAttachmentItem',
  props: {
    allActionsOnEdit: {
      type: Boolean,
      default: false
    },
    attachment: {
      type: Object,
      required: true
    },
    idProperties: {
      type: Object,
      default: () => {}
    },
    readOnly: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      displayActionList: false,
      downloadAction: {
        label: this.$t('NeroAttachment.NeroAttachmentItem.downloadActionLabel'),
        callback: this.dowloadAttachment,
        icon: 'fa fa-download theme-text-color'
      },
      removeAction: {
        label: this.$t('NeroAttachment.NeroAttachmentItem.removeActionLabel'),
        callback: this.removeAttachment,
        icon: 'fa fa-trash theme-text-color'
      },
      sendToWorkspaceAction: {
        label: this.$t('NeroAttachment.NeroAttachmentItem.sendToWorkspaceActionLabel'),
        callback: this.sendAttachment,
        icon: 'fas fa-folder theme-text-color'
      },
      viewAction: {
        label: this.$t('NeroAttachment.NeroAttachmentItem.displayActionLabel'),
        callback: this.displayAttachment,
        icon: 'fa fa-eye theme-text-color'
      }
    }
  },
  computed: {
    actionList () {
      var actionList = []
      if (this.displayReadOnlyActions) {
        if (this.isViewable || this.attachment.isEDXAssignement) {
          actionList.push(this.viewAction)
        }
        if (!this.attachment.isEDXAssignement) {
          actionList.push(this.downloadAction)
        }
        if (this.$store.state.user.application.hasWorkspace && !this.attachment.isEDXAssignement) {
          // Send if hasWorkspace && not edx
          actionList.push(this.sendToWorkspaceAction)
        }
      }

      // Remove if not readOnly
      if (!this.readOnly) {
        actionList.push(this.removeAction)
      }
      return actionList
    },
    displayReadOnlyActions () {
      return (this.readOnly || this.allActionsOnEdit)
    },
    isViewable () {
      return NeroUtils.Document.File.isViewable(this.attachment.name)
    }
  },
  methods: {
    displayAttachment () {
      if (this.attachment.isEDXAssignement) {
        console.log('open edx modal')
      } else if (this.isViewable) {
        // use idProperties
        console.log('on view')
      }
    },
    dowloadAttachment () {
      console.log('on download', this.attachment.link)
      window.open(this.attachment.link + '&contentDispo=attachment', '_self')
    },
    removeAttachment () {
      this.$emit('remove')
    },
    sendAttachment () {
      // use idProperties
      console.log('on send')
    },
    runActionCallback (action) {
      action.callback()
      this.toggleContextMenu()
    },
    toggleContextMenu () {
      this.displayActionList = !this.displayActionList
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.attachment {
  flex: 1 0 48%;
  display: flex;
  position: relative;
  background-color: $menu-background-color;
  margin: 2px 5px;
  padding: 5px 3px;
  border-radius: $border-radius;
  @extend %item-shadow;
}

.viewable:hover {
  cursor: pointer;
  text-decoration: underline;
}

.context-menu-toggle {
  margin-left: auto;
  padding: 0 5px;
  cursor: pointer;
}

.context-menu {
  top: 32px;
  left: 0;
}
</style>
