<template>
  <ServicesWrapper
    :is-title-visible="true"
    :title="$t('Logbook.serviceTitle')"
  >
    <div class="container-logbook">
      <div class="header">
        <div
          v-if="(isTeacher || isDirector || isSecretariat) && !mq.phone && !mq.tablet"
          class="container-create-entry"
        >
          <WeprodeButton
            class="create-button"
            data-test="create-entry-button"
            @click="displayCreateEntryOptions"
          >
            <CustomIcon icon-name="icon-plus" />
            <span>{{ $t('Logbook.newEntryButtonLabel') }}</span>
          </WeprodeButton>
          <ContextMenu
            v-if="isContextMenuDisplayed"
            class="context-menu"
            data-test="containerCreateEntryOptions"
            :is-absolute="true"
            @close="isContextMenuDisplayed = false"
            @choose-option="optionClicked"
          />
        </div>
        <EntriesFilter v-if="isTeacher || isDirector || isSecretariat || isParent" />
      </div>
      <EntryTypeFilter v-if="isTeacher || isDirector || isSecretariat" />
      <component :is="isTeacher || isDirector || isSecretariat ? 'v-fragment' : 'WeprodeTabList'">
        <component
          :is="isTeacher || isDirector || isSecretariat ? 'v-fragment' : 'WeprodeTabItem'"
          :title="$t('Logbook.entryTabLabel')"
          :nb-notification="nbNotifications"
        >
          <EntriesList
            :is-entry-created="isEntryCreated"
            @is-refreshed="isEntryCreated = false"
          />
          <div
            v-if="(isTeacher || isDirector || isSecretariat) && (mq.phone || mq.tablet)"
            class="container-create-entry-mobile"
          >
            <WeprodeButton
              class="create-button mobile"
              data-test="create-entry-button"
              @click="displayCreateEntryOptions"
            >
              <CustomIcon icon-name="icon-plus" />
            </WeprodeButton>
            <ContextMenu
              v-if="isContextMenuDisplayed && (mq.phone || mq.tablet)"
              data-test="containerCreateEntryOptions"
              :is-absolute="true"
              @close="isContextMenuDisplayed = false"
              @choose-option="optionClicked"
            />
          </div>
        </component>
        <component
          :is="isTeacher || isDirector || isSecretariat ? 'v-fragment' : 'WeprodeTabItem'"
          :title="$t('Logbook.schoolLifeTabLabel')"
        />
      </component>
    </div>
  </ServicesWrapper>
  <teleport to="body">
    <EntriesEditModal
      v-if="isDisplayEditModal && configuration"
      :entry-type="entryType"
      @close="isDisplayEditModal = false"
      @entry-created="setIsEntryCreated"
    />
  </teleport>
</template>

<script>

import CustomIcon from '@components/Base/CustomIcon.vue'
import VFragment from '@components/Base/VFragment.vue'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue'
import EntriesEditModal from '@/components/Logbook/EntriesEditModal.vue'
import EntriesFilter from '@/components/Logbook/EntriesFilter.vue'
import EntriesList from '@/components/Logbook/EntriesList.vue'
import EntryTypeFilter from '@/components/Logbook/EntryTypeFilter.vue'
import ServicesWrapper from '@/components/ServicesWrapper/ServicesWrapper.vue'

export default {
  name: 'Course',
  components: {
    ServicesWrapper,
    EntriesEditModal,
    EntriesFilter,
    WeprodeButton,
    EntriesList,
    CustomIcon,
    WeprodeTabItem,
    WeprodeTabList,
    VFragment,
    ContextMenu,
    EntryTypeFilter
  },
  inject: ['mq'],
  emits: ['update:layout'],
  data () {
    return {
      isDisplayEditModal: false,
      isEntryCreated: false,
      isContextMenuDisplayed: false,
      entryType: undefined
    }
  },
  computed: {
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    isDirector () {
      return this.$store.state.user.isDirectionMember
    },
    isSecretariat () {
      return this.$store.state.user.isSecretariat
    },
    isParent () {
      return this.$store.state.user.isParent
    },
    configuration () {
      return this.$store.state.calendar.configuration
    },
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    },
    createMenu () {
      const options = [
        {
          name: 'createInformation',
          i18nKey: 'Logbook.entriesItem.entryTypeInformation',
          position: 0,
          hasSeparator: false
        },
        {
          name: 'createAuthorization',
          i18nKey: 'Logbook.entriesItem.entryTypeAuthorization',
          position: 1,
          hasSeparator: false
        },
        {
          name: 'createObservation',
          i18nKey: 'Logbook.entriesItem.entryTypeObservation',
          position: 2,
          hasSeparator: false
        }
      ]
      return options
    },
    nbNotifications () {
      return this.$store.state.menu.notifications.logbook
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    if (!this.configuration) {
      this.$store.dispatch('calendar/getConfiguration')
    }
  },
  methods: {
    openEntriesEditModal () {
      this.isDisplayEditModal = true
    },
    setIsEntryCreated () {
      this.isEntryCreated = true
    },
    displayCreateEntryOptions (event) {
      if (!this.isAContextMenuDisplayed) {
        this.isContextMenuDisplayed = true
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event,
            options: this.createMenu
          })
      }
    },
    optionClicked (option) {
      switch (option.name) {
        case 'createInformation':
          this.entryType = 1
          this.isDisplayEditModal = true
          break
        case 'createAuthorization':
          this.entryType = 2
          this.isDisplayEditModal = true
          break
        case 'createObservation':
          this.entryType = 3
          this.isDisplayEditModal = true
          break
        default:
          console.error('unknown action for option', option)
      }
      this.isContextMenuDisplayed = false
      this.$store.dispatch('contextMenu/closeMenus')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.header {
  display: flex;
  gap: 30px;

  button {
    height: fit-content;
  }
}

.container-create-entry {
  position: relative;
}

.container-create-entry-mobile {
  position: fixed;
  bottom: 24px;
  right: 24px;

  .context-menu {
    bottom: 100% !important;
    right: 0 !important;
    left: auto !important;
    top: auto !important;
  }
}

.create-button {
  @extend %create-button;

  &.mobile {
    border-radius: 100%;
    border: 3px solid $neutral-10;
  }
}

.first-line {
  margin-bottom: 0.5rem;
  display: flex;
}
</style>
