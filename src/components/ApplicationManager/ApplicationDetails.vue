<template>
  <div
    ref="popup"
    v-click-outside="closeDetails"
    :class="isRightOriented ? 'right' : 'left'"
    class="details"
  >
    <div class="content">
      <div class="main">
        <img
          v-if="application.image"
          :src="application.image"
          class="logo"
        >
        <div
          v-else
          class="logo"
        >
          <i class="fa fa-image" />
        </div>

        <div class="name">
          <h5>
            {{ application.serviceName }}
          </h5>
          <PentilaInput
            v-if="application.hasCustomUrl"
            v-model="applicationURL"
            :placeholder="$t('ApplicationManager.ApplicationDetails.customUrlPlaceholder')"
            type="url"
          />
        </div>
      </div>

      <div class="broadcast">
        <p
          v-if="application.isAvailable"
          v-t="'ApplicationManager.ApplicationDetails.broadcastLabel'"
        />
        <p
          v-else
          v-t="'ApplicationManager.ApplicationDetails.noBroadcastLabel'"
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
        <p v-t="'ApplicationManager.ApplicationDetails.exportLabel'" />
        <div class="app-export-buttons">
          <PentilaButton
            v-if="application.exportParent"
            :label="$t('ApplicationManager.ApplicationDetails.parentsExportButton')"
            @click="exportUserList('parent')"
          />

          <PentilaButton
            v-if="application.exportStudent"
            :label="$t('ApplicationManager.ApplicationDetails.studentsExportButton')"
            @click="exportUserList('eleve')"
          />

          <PentilaButton
            v-if="application.exportTeacher"
            :label="$t('ApplicationManager.ApplicationDetails.teachersExportButton')"
            @click="exportUserList('prof')"
          />

          <PentilaButton
            v-if="application.exportOther"
            :label="$t('ApplicationManager.ApplicationDetails.otherExportButton')"
            @click="exportUserList('other')"
          />
        </div>
      </div>
    </div>
    <div class="action">
      <PentilaToggleSwitch
        :model-value="application.isAvailable"
        :title="$t('ApplicationManager.ApplicationDetails.broadcastButtonTooltip')"
        @update:modelValue="updateBroadcastStatus"
      />
      <PentilaButton
        v-if="isAdministrator"
        :title="$t('ApplicationManager.ApplicationDetails.editButtonTooltip')"
        type="circle"
        @click="toggleEditionModal"
      >
        <i class="fa fa-pencil-alt" />
      </PentilaButton>
      <PentilaButton
        :title="$t('ApplicationManager.ApplicationDetails.configurationButtonTooltip')"
        type="circle"
        @click="toggleBroadcastModal"
      >
        <i class="fa fa-cog" />
      </PentilaButton>
      <PentilaButton
        v-if="application.hasCustomUrl"
        :title="$t('ApplicationManager.ApplicationDetails.guideButtonTooltip')"
        type="circle"
      >
        <i class="fa fa-book" />
      </PentilaButton>
      <PentilaButton
        v-if="application.hasCustomUrl"
        :title="$t('ApplicationManager.ApplicationDetails.saveButtonTooltip')"
        type="circle"
        @click="updateURL"
      >
        <i class="fa fa-save" />
      </PentilaButton>
      <PentilaButton
        v-if="isAdministrator"
        :title="$t('ApplicationManager.ApplicationDetails.deleteButtonTooltip')"
        type="circle"
        cls="cancel"
        @click="confirmRemoval"
      >
        <i class="fa fa-trash" />
      </PentilaButton>
    </div>
  </div>
</template>

<script>
import { directive } from 'vue3-click-away'
import RuleLabel from '@/components/ApplicationManager/RuleLabel'

export default {
  name: 'ApplicationDetails',
  components: {
    RuleLabel
  },
  directives: {
    'click-outside': directive
  },
  emits: ['closeDetails'],
  data () {
    return {
      domRect: undefined
    }
  },
  computed: {
    application () {
      return this.$store.state.applicationManager.selectedApplication
    },
    hasExport () {
      return (this.application.exportParent ||
        this.application.exportStudent ||
        this.application.exportTeacher ||
        this.application.exportOther)
    },
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    isRightOriented () {
      // If there is not enough space at the right change orientation
      if (this.domRect) {
        if ((window.innerWidth - this.domRect.x) < this.domRect.width) {
          return false
        }
      }
      return true
    }
  },
  created () {
    this.applicationURL = this.application.serviceUrl
  },
  mounted () {
    this.domRect = this.$refs.popup.getBoundingClientRect()
  },
  methods: {
    closeDetails () {
      this.$emit('closeDetails')
    },
    confirmRemoval () {
      const confirmParams = {
        buttonLabel: this.$t('ApplicationManager.ApplicationDetails.removalConfirmButtonLabel'),
        message: this.$t('ApplicationManager.ApplicationDetails.removalConfirmMessage'),
        onConfirm: this.removeApplication,
        title: this.$t('ApplicationManager.ApplicationDetails.removalConfirmTitle')
      }
      this.$store.dispatch('nero/openConfirmModal', confirmParams)
    },
    exportUserList (type) {
      this.$store.dispatch('applicationManager/exportApplicationUserList', {
        school: this.$store.state.administration.selectedSchool,
        type
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
      this.$store.dispatch('applicationManager/updateURL', {
        school: this.$store.state.administration.selectedSchool,
        applicationURL: this.applicationURL
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.details {
  display: flex;
  padding: 7px;
  width: 345px;
  position: absolute;
  background: $color-toolbar-bg;
  z-index: 3;
  border-radius: $light-radius-size;
  @extend %object-shadow;
}

.left {
  right: 0;
}

.logo {
  width: 70px;
  height: 70px;
  margin-right: 5px;
  font-size: 53px;

  i {
    color: lightgray;
    padding: 5px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}

.main {
  display: flex;
}

.name {
  margin-top: 6px;
  vertical-align: top;
  width: 100%;
  padding-right: 5px;

  h5 {
    margin: 0;
  }
}

p {
  margin-top: 10px;
}

.list-rules {
  list-style: disc;
  padding-left: 15px;
}

.action {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
