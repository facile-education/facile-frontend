<template>
  <div
    class="content"
    :class="{ phone: mq.phone }"
  >
    <WeprodeInput
      v-if="application.hasCustomUrl"
      v-model="applicationURL"
      :placeholder="$t('ApplicationManager.ApplicationDetails.customUrlPlaceholder')"
      type="url"
      class="input"
      @blur="updateURL"
      @keyup.enter="updateURL"
    />

    <div
      v-if="!isAdministratorMode"
      class="broadcast"
    >
      <p
        v-if="application.isBroadcasted"
        v-t="'ApplicationManager.ApplicationDetails.broadcastLabel'"
      />
      <p
        v-else
        v-t="'ApplicationManager.ApplicationDetails.noBroadcastLabel'"
      />
      <p
        v-if="!hasRules"
        v-t="'ApplicationManager.ApplicationDetails.addRule'"
      />
      <ul
        v-if="application.isBroadcasted"
        class="list-rules"
      >
        <li
          v-for="(rule, index) in application.rules"
          :key="index"
        >
          <RuleLabel :rule="rule" />
        </li>
      </ul>
    </div>

    <div v-if="hasExport">
      <p v-t="'ApplicationManager.ApplicationDetails.exportLabel'" />
      <WeprodeDropdown
        v-if="!isAdministratorMode"
        v-model="selectedExport"
        :list="exportList"
        display-field="label"
        class="export-list"
      />
      <WeprodeButton
        :title="$t('ApplicationManager.ApplicationDetails.export')"
        @click="exportUserList"
      >
        <span>{{ $t('ApplicationManager.ApplicationDetails.export') }}</span>
      </WeprodeButton>
      <p>{{ exportMessage }}</p>
    </div>
  </div>
  <div
    class="action"
    :class="{ phone: mq.phone }"
  >
    <WeprodeToggleSwitch
      v-if="!isAdministratorMode"
      :model-value="application.isBroadcasted"
      :title="$t('ApplicationManager.ApplicationDetails.broadcastButtonTooltip')"
      :disabled="!hasRules"
      @update:model-value="updateBroadcast"
    />
    <WeprodeButton
      v-if="isAdministrator && isAdministratorMode"
      :title="$t('ApplicationManager.ApplicationDetails.editButtonTooltip')"
      type="circle"
      @click="toggleEditionModal"
    >
      <CustomIcon icon-name="icon-edit" />
    </WeprodeButton>
    <WeprodeButton
      v-if="!isAdministratorMode"
      :title="$t('ApplicationManager.ApplicationDetails.configurationButtonTooltip')"
      type="circle"
      @click="toggleBroadcastModal"
    >
      <CustomIcon icon-name="icon-admin" />
    </WeprodeButton>
    <WeprodeButton
      v-if="isAdministrator && isAdministratorMode"
      :title="$t('ApplicationManager.ApplicationDetails.deleteButtonTooltip')"
      :aria-label="$t('ApplicationManager.ApplicationDetails.deleteButtonTooltip')"
      class="delete-button"
      type="circle"
      cls="delete"
      @click="confirmRemoval"
    >
      <CustomIcon :icon-name="'icon-trash'" />
    </WeprodeButton>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

import { exportApplicationUserList } from '@/api/applicationManager.service'
import RuleLabel from '@/components/ApplicationManager/RuleLabel'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeToggleSwitch from '@/components/Base/Weprode/WeprodeToggleSwitch.vue'

export default {
  name: 'ApplicationDetails',
  components: {
    CustomIcon,
    RuleLabel,
    WeprodeButton,
    WeprodeDropdown,
    WeprodeInput,
    WeprodeToggleSwitch
  },
  inject: ['mq'],
  data () {
    return {
      applicationURL: '',
      exportMessage: '',
      domRect: undefined,
      selectedExport: undefined
    }
  },
  computed: {
    application () {
      return this.$store.state.applicationManager.selectedApplication
    },
    hasRules () {
      return (this.application.rules !== undefined && this.application.rules.length > 0)
    },
    exportList () {
      const list = []
      if (this.application.exportStudent) {
        list.push({ label: this.$t('ApplicationManager.ApplicationDetails.studentsExportButton'), key: 'eleve' })
      }
      if (this.application.exportParent) {
        list.push({ label: this.$t('ApplicationManager.ApplicationDetails.parentsExportButton'), key: 'parent' })
      }
      if (this.application.exportTeacher) {
        list.push({ label: this.$t('ApplicationManager.ApplicationDetails.teachersExportButton'), key: 'prof' })
      }
      if (this.application.exportOther) {
        list.push({ label: this.$t('ApplicationManager.ApplicationDetails.otherExportButton'), key: 'other' })
      }
      return list
    },
    hasExport () {
      return (this.exportList.length > 0)
    },
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    isAdministratorMode () {
      return this.$store.state.applicationManager.isAdministratorMode
    }
  },
  created () {
    this.applicationURL = this.application.applicationUrl
    this.selectedExport = this.exportList[0]
  },
  methods: {
    confirmRemoval () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('ApplicationManager.ApplicationDetails.removalConfirmMessage'),
        lastAction: { fct: this.removeApplication, params: [] }
      })
    },
    exportUserList () {
      exportApplicationUserList(this.$store.state.applicationManager.selectedApplication.applicationId, this.$store.state.administration.selectedSchool.schoolId, this.selectedExport.key)
        .then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('ApplicationManager.ApplicationDetails.exportSuccess'), type: 'success' })
            this.exportMessage = data.msg
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('ApplicationManager.ApplicationDetails.exportError'), type: 'error' })
          }
        })
    },
    toggleBroadcastModal () {
      this.$store.dispatch('applicationManager/openBroadcastModal')
    },
    toggleEditionModal () {
      this.$store.dispatch('applicationManager/openEditionModal')
    },
    removeApplication () {
      this.$store.dispatch('applicationManager/removeApplication')
    },
    updateBroadcast (isBroadcasted) {
      this.$store.dispatch('applicationManager/updateBroadcast', {
        school: this.$store.state.administration.selectedSchool,
        isBroadcasted
      })
    },
    updateURL () {
      if (this.applicationURL !== this.application.applicationUrl) {
        this.$store.dispatch('applicationManager/updateURL', {
          school: this.$store.state.administration.selectedSchool,
          applicationURL: this.applicationURL
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.left {
  .content {
    margin-left: 0;
    border-left: none;
    border-radius: $light-radius-size;
  }

  .action {
    margin-right: 150px;
    border-right: 1px solid $color-border;
    border-radius: 0;
  }
}

.content {
  height: 100%;
  min-width: 285px;
  margin-left: 150px;
  padding: 10px;
  background-color: white;
  overflow: auto;
  border-left: 1px solid $color-border;
}

.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 18px;
  }
}

.input {
  margin-bottom: 10px;
}

p {
  margin: 0;
}

.broadcast {
  margin-bottom: 10px;
}

.icon-admin {
  font-size: 1.3rem;
}

.list-rules {
  list-style: disc;
  padding-left: 15px;
}

.export-list {
  margin-bottom: 10px;
  margin-right: 10px;
}

.action {
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: white;
  border-radius: $light-radius-size;
}

.icon-trash {
  color: white;
}

.phone {
  &.action {
    flex-direction: row;
  }

  &.content {
    margin-left: 0;
    border: none;
  }
}
</style>
