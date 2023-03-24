<template>
  <button
    v-if="isCurrentFolder && (mq.phone || mq.tablet) && !isFirstElement"
    class="return-back"
    data-test="back"
    @click="clickBack"
  >
    <img
      src="@assets/icon_arrow_left.svg"
      class="image"
      alt="go back"
    >
    <span class="previous-name">{{ (previousFolderName.length > 12) ? $t('Commons.back') : previousFolderName }}</span>
  </button>
  <button
    v-if="(!mq.phone && !mq.tablet) || isCurrentFolder"
    class="breadcrumb-item"
    data-test="breadcrumb-item"
    :class="{ 'active': isActive, 'first-element': isFirstElement, 'phone-breadcrumb-item': mq.phone || mq.tablet, 'current-folder': isCurrentFolder }"
    :title="folder.name"
    @dragover="setActive"
    @dragleave="cancelActive"
    @drop="dropFile"
    @click.stop="changeDir"
  >
    <div class="name">
      <span>
        {{ folder.name }}
      </span>
      <img
        v-if="!isFirstElement && isCurrentFolder && folder.isGroupDirectory"
        class="collaborative"
        src="@assets/icons/users.svg"
        alt=""
      >
      <button
        v-if="currentOptions.length > 0 && isFirstElement"
        class="first-folder-options"
        @click.stop="toggleContextMenu"
      >
        <BaseIcon
          class="icon"
          name="chevron-down"
        />
      </button>
      <div
        v-else-if="currentOptions.length > 0"
        class="current-folder-options"
      >
        <BaseIcon
          class="icon"
          name="chevron-down"
        />
      </div>
    </div>

    <ContextMenu
      v-if="isContextMenuDisplayed && isAContextMenuDisplayed"
      :is-absolute="true"
      @chooseOption="handleOption"
      @close="isContextMenuDisplayed=false"
    />
  </button>

  <teleport to="body">
    <FolderNameModal
      v-if="isFolderNameModalDisplayed"
      submit-action="rename"
      :init-folder="folder"
      @close="isFolderNameModalDisplayed=false"
    />
  </teleport>
</template>

<script>

import BaseIcon from '@components/Base/BaseIcon'
import ContextMenu from '@components/ContextMenu/ContextMenu'
import { currentFolderOptions, spaceSelectionOptions } from '@/constants/options'
import { downloadDocument } from '@utils/documents.util'
import FolderNameModal from '@components/Documents/Modals/FolderNameModal'

export default {
  name: 'BreadCrumbItem',
  components: { FolderNameModal, ContextMenu, BaseIcon },
  inject: ['mq'],
  props: {
    folder: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    hiddenActions: {
      type: Boolean,
      default: false
    },
    previousFolderName: {
      type: String,
      default: ''
    },
    isFirstElement: {
      type: Boolean,
      default: false
    },
    isCurrentFolder: {
      type: Boolean,
      default: false
    }
  },
  emits: ['changeDir', 'changeSpace', 'clickBack'],
  data () {
    return {
      isFolderNameModalDisplayed: false,
      isContextMenuDisplayed: false,
      isActive: false
    }
  },
  computed: {
    isThereInternDocumentDrag () {
      return this.$store.state.misc.isThereDocumentDrag
    },
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    },
    isGroupFolder () {
      return this.folder.type === 'Group' || this.folder.isGroupRootFolder
    },
    currentOptions () {
      if (!this.hiddenActions && this.isCurrentFolder && !this.isFirstElement && !this.isGroupFolder) {
        return [...currentFolderOptions]
      } else if (this.isFirstElement) {
        return [...spaceSelectionOptions]
      } else {
        return []
      }
    }
  },
  methods: {
    openContextMenu (event) {
      if (!this.isAContextMenuDisplayed) {
        this.isContextMenuDisplayed = true
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event: event,
            options: this.currentOptions
          })
      }
    },
    cancelHandlers (e) {
      e.preventDefault()
      e.stopPropagation()
    },
    setActive (e) {
      if (this.isThereInternDocumentDrag && !this.isCurrentFolder && this.folder.permissions.ADD_OBJECT) {
        this.isActive = true
        this.cancelHandlers(e)
      }
    },
    cancelActive (e) {
      if (this.isThereInternDocumentDrag && !this.isCurrentFolder) {
        this.isActive = false
        this.cancelHandlers(e)
      }
    },
    dropFile (e) {
      if (this.isThereInternDocumentDrag) {
        this.cancelActive(e)
        // dropFileAction
        this.folder.dropMethod(e, this.folder)
      }
    },
    clickBack () {
      this.$emit('clickBack')
    },
    changeDir (event) {
      if (!this.isCurrentFolder) {
        if (this.isContextMenuDisplayed) {
          this.toggleContextMenu()
        } else {
          this.$emit('changeDir', this.folder)
        }
      } else if (this.currentOptions.length > 0) {
        this.toggleContextMenu(event)
      }
    },
    toggleContextMenu (event) {
      if (!this.isContextMenuDisplayed && !this.isAContextMenuDisplayed) {
        this.openContextMenu(event)
      } else {
        this.isContextMenuDisplayed = false
        this.$store.dispatch('contextMenu/closeMenus')
      }
    },
    handleOption (option) {
      switch (option.name) {
        case 'rename':
          this.isFolderNameModalDisplayed = true
          break
        case 'download':
          downloadDocument(this.folder)
          break
        case 'documents':
          this.$emit('changeSpace', '/documents')
          break
        case 'groups':
          this.$emit('changeSpace', '/documents/groups')
          break
        case 'recent':
          this.$emit('changeSpace', '/documents/recent')
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.isContextMenuDisplayed = false
      this.$store.dispatch('contextMenu/closeMenus')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.return-back {
  background: none;
  height: 35px;
  padding: 0 5px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  .previous-name {
    white-space: nowrap;
    margin-left: 5px;
    line-height: 100%;
  }

  .image {
    height: 12px;
  }
}

.breadcrumb-item {
  height: 40px;
  display: flex;
  position: relative;
  align-items: center;
  cursor: pointer;
  font-size: 1em;
  letter-spacing: 0;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid transparent;
  margin-right: 3px;
  padding: 3px;
  background: none;

  &.current-folder {
    font-weight: bold;
  }

  &:not(.phone-breadcrumb-item):not(.current-folder) {
    max-width: 150px;
  }

  &:hover:not(.phone-breadcrumb-item) {
    border-bottom: 1px solid black;
  }

  &.first-element {
    font-size: 1em;
    letter-spacing: 0;
    line-height: 24px;

    img {
      margin-top: -6px;
      height: 28px;
      margin-right: 10px;
    }
  }
}

.name {
  display: flex;
  align-items: center;
  width: 100%;

  span {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.collaborative {
  margin-left: 10px;
}

.first-folder-options {
  position: relative;
  cursor: pointer;
  margin-left: 10px;
  padding: 0;
  border: none;
  background-color: white;

  .icon {
    font-size: 12px;
  }
}

.current-folder-options {
  margin-left: 10px;
  position: relative;

  .icon {
    font-size: 12px;
  }

  .img-container {
    height: 33px;
    width: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 17px;
    background-color: $color-not-white-bg;

    &.active {
      background-color: $color-active-bg;
    }
  }

  .options {
    position: absolute;
    left: 110%;
    top: 0;
  }
}

.phone-breadcrumb-item {
  width: 100%;
  border-radius: 0;
  margin-right: 0;
  padding: 0;

  &.first-element {
    width: 70%;
    margin: auto;
  }

  .name {
    margin: auto;
    font-size: 1.225em;
    max-width: 90%;
  }

  .current-folder-options {
    .options {
      left: auto;
      right: 0;
      top: 135%;
    }
  }
}

.active {
  color: $color-light-text;
  background-color: $color-active-bg;
}

//.slide-fade-enter-active {
//  transition: all .3s ease;
//}
//.slide-fade-leave-active {
//  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
//}
//.slide-fade-enter-from, .slide-fade-leave-to
//  /* TODO hide the overflow when translating*/ {
//  transform: translateY(-100%);
//  opacity: 0.5;
//}

</style>
