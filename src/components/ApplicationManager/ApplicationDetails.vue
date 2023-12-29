<template>
  <div
    class="content"
    :class="{ phone: mq.phone }"
  >
    <WeprodeInput
      v-if="application.hasCustomUrl"
      v-model="applicationURL"
      :placeholder="$t('customUrlPlaceholder')"
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
        v-t="'broadcastLabel'"
      />
      <p
        v-else
        v-t="'noBroadcastLabel'"
      />
      <p
        v-if="!hasRules"
        v-t="'addRule'"
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
      <p v-t="'exportLabel'" />
      <WeprodeDropdown
        v-if="!isAdministratorMode"
        v-model="selectedExport"
        :list="exportList"
        display-field="label"
        class="export-list"
        @update:model-value="exportUserList"
      />
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
      :title="$t('broadcastButtonTooltip')"
      :disabled="!hasRules"
      @update:model-value="updateBroadcast"
    />
    <WeprodeButton
      v-if="isAdministrator && isAdministratorMode"
      :title="$t('editButtonTooltip')"
      type="circle"
      @click="toggleEditionModal"
    >
      <NeroIcon name="pencil-alt" />
    </WeprodeButton>
    <WeprodeButton
      v-if="!isAdministratorMode"
      :title="$t('configurationButtonTooltip')"
      type="circle"
      @click="toggleBroadcastModal"
    >
      <NeroIcon name="cog" />
    </WeprodeButton>
    <WeprodeButton
      v-if="isAdministrator && isAdministratorMode"
      :title="$t('deleteButtonTooltip')"
      class="delete-button"
      type="circle"
      cls="delete"
      @click="confirmRemoval"
    >
      <img
        src="@assets/icons/trash_white.svg"
        :alt="$t('deleteButtonTooltip')"
      >
    </WeprodeButton>
  </div>
</template>

<script>
import RuleLabel from '@/components/ApplicationManager/RuleLabel'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeToggleSwitch from '@/components/Base/Weprode/WeprodeToggleSwitch.vue'
import NeroIcon from '@/components/Nero/NeroIcon'
export default {
  name: 'ApplicationDetails',
  components: {
    NeroIcon,
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
        list.push({ label: this.$t('studentsExportButton'), key: 'eleve' })
      }
      if (this.application.exportParent) {
        list.push({ label: this.$t('parentsExportButton'), key: 'parent' })
      }
      if (this.application.exportTeacher) {
        list.push({ label: this.$t('teachersExportButton'), key: 'prof' })
      }
      if (this.application.exportOther) {
        list.push({ label: this.$t('otherExportButton'), key: 'other' })
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
        text: this.$t('removalConfirmMessage'),
        lastAction: { fct: this.removeApplication, params: [] }
      })
    },
    exportUserList (type) {
      this.$store.dispatch('applicationManager/exportApplicationUserList', {
        school: this.$store.state.administration.selectedSchool,
        type: type.key
      }).then((msg) => {
        this.exportMessage = msg
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

.list-rules {
  list-style: disc;
  padding-left: 15px;
}

.export-list {
  margin-bottom: 10px 0;
}

.action {
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: white;
  border-radius: $light-radius-size;
}

.phone {
  &.action {
    flex-direction: row;
  }

  &.content {
    margin-left: 0;
    /*overflow: ;*/
    border: none;
  }
}
</style>

<i18n locale="fr">
{
  "broadcastButtonTooltip": "Diffuser",
  "broadcastLabel": "Diffusée aux profils suivants :",
  "configurationButtonTooltip": "Gérer les règles de diffusion",
  "customUrlPlaceholder": "http(s)://...",
  "deleteButtonTooltip": "Supprimer",
  "editButtonTooltip": "Modifier",
  "exportLabel": "Exports nécessaires :",
  "noBroadcastLabel": "L'application n'est pas diffusée.",
  "addRule": "Veuillez au préalable ajouter une règle de diffusion.",
  "otherExportButton": "Ressources",
  "parentsExportButton": "Parents",
  "removalConfirmButtonLabel": "Supprimer",
  "removalConfirmMessage": "Souhaitez-vous vraiment supprimer cette application ?",
  "removalConfirmTitle": "Suppression",
  "studentsExportButton": "Elèves",
  "teachersExportButton": "Enseignants"
}
</i18n>
