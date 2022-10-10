<template>
  <div
    class="content"
    :class="{ phone: mq.phone }"
  >
    <PentilaInput
      v-if="application.hasCustomUrl"
      v-model="applicationURL"
      :placeholder="$t('customUrlPlaceholder')"
      type="url"
      class="input"
      @blur="updateURL"
      @keyup.enter="updateURL"
    />

    <div class="broadcast">
      <p
        v-if="application.isAvailable"
        v-t="'broadcastLabel'"
      />
      <p
        v-else
        v-t="'noBroadcastLabel'"
      />
      <ul
        v-if="application.isAvailable"
        class="list-rules"
      >
        <RuleLabel
          v-for="(rule, index) in application.rules"
          :key="index"
          :rule="rule"
        />
      </ul>
    </div>

    <div v-if="hasExport">
      <p v-t="'exportLabel'" />
      <PentilaDropdown
        v-model="selectedExport"
        :list="exportList"
        display-field="label"
        class="export-list"
        @update:modelValue="exportUserList"
      />
      <p v-html="exportMessage" />
    </div>
  </div>
  <div
    class="action"
    :class="{ phone: mq.phone }"
  >
    <PentilaToggleSwitch
      :model-value="application.isAvailable"
      :title="$t('broadcastButtonTooltip')"
      @update:modelValue="updateBroadcastStatus"
    />
    <PentilaButton
      v-if="isAdministrator"
      :title="$t('editButtonTooltip')"
      type="circle"
      @click="toggleEditionModal"
    >
      <NeroIcon name="pencil-alt" />
    </PentilaButton>
    <PentilaButton
      :title="$t('configurationButtonTooltip')"
      type="circle"
      @click="toggleBroadcastModal"
    >
      <NeroIcon name="cog" />
    </PentilaButton>
    <PentilaButton
      v-if="isAdministrator"
      :title="$t('deleteButtonTooltip')"
      type="circle"
      cls="delete"
      @click="confirmRemoval"
    >
      <NeroIcon name="trash" />
    </PentilaButton>
  </div>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'
import RuleLabel from '@/components/ApplicationManager/RuleLabel'

export default {
  name: 'ApplicationDetails',
  components: {
    NeroIcon,
    RuleLabel
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
    }
  },
  created () {
    this.applicationURL = this.application.serviceUrl
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
    updateBroadcastStatus (isAvailable) {
      this.$store.dispatch('applicationManager/updateBroadcastStatus', {
        school: this.$store.state.administration.selectedSchool,
        isAvailable
      })
    },
    updateURL () {
      if (this.applicationURL !== this.application.serviceUrl) {
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
  "noBroadcastLabel": "L'application n'est pas diffusée",
  "otherExportButton": "Ressources",
  "parentsExportButton": "Parents",
  "removalConfirmButtonLabel": "Supprimer",
  "removalConfirmMessage": "Souhaitez-vous vraiment supprimer cette application ?",
  "removalConfirmTitle": "Suppression",
  "studentsExportButton": "Elèves",
  "teachersExportButton": "Enseignants"
}
</i18n>
