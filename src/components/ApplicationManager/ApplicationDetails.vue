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
        <NeroFallbackThumbnail
          v-else
          class="logo"
        />

        <div class="name">
          <h5>
            {{ application.serviceName }}
          </h5>
          <NeroInput
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
          <NeroButton
            v-if="application.exportParent"
            :label="$t('ApplicationManager.ApplicationDetails.parentsExportButton')"
            @click="exportUserList('parent')"
          />

          <NeroButton
            v-if="application.exportStudent"
            :label="$t('ApplicationManager.ApplicationDetails.studentsExportButton')"
            @click="exportUserList('eleve')"
          />

          <NeroButton
            v-if="application.exportTeacher"
            :label="$t('ApplicationManager.ApplicationDetails.teachersExportButton')"
            @click="exportUserList('prof')"
          />
        </div>
      </div>
    </div>
    <div class="action">
      <NeroToggleSwitch
        :value="application.isAvailable"
        :title="$t('ApplicationManager.ApplicationDetails.broadcastButtonTooltip')"
        @input="updateBroadcastStatus"
      />
      <NeroButton
        v-if="isAdministrator"
        :title="$t('ApplicationManager.ApplicationDetails.editButtonTooltip')"
        type="circle"
        icon="fa fa-pencil-alt"
        @click="toggleEditionModal"
      />
      <NeroButton
        :title="$t('ApplicationManager.ApplicationDetails.configurationButtonTooltip')"
        type="circle"
        icon="fa fa-cog"
        @click="toggleBroadcastModal"
      />
      <NeroButton
        v-if="application.hasCustomUrl"
        :title="$t('ApplicationManager.ApplicationDetails.guideButtonTooltip')"
        type="circle"
        icon="fa fa-book"
      />
      <NeroButton
        v-if="application.hasCustomUrl"
        :title="$t('ApplicationManager.ApplicationDetails.saveButtonTooltip')"
        type="circle"
        icon="fa fa-save"
        @click="updateURL"
      />
      <NeroButton
        v-if="isAdministrator"
        :title="$t('ApplicationManager.ApplicationDetails.deleteButtonTooltip')"
        type="circle"
        cls="cancel"
        icon="fa fa-trash"
        @click="confirmRemoval"
      />
    </div>
  </div>
</template>

<script>
import clickoutside from '@/directives/clickoutside'
import RuleLabel from '@/components/ApplicationManager/RuleLabel'
import NeroButton from '@/components/Nero/NeroButton'
import NeroFallbackThumbnail from '@/components/Nero/NeroFallbackThumbnail'
import NeroInput from '@/components/Nero/NeroInput'
import NeroToggleSwitch from '@/components/Nero/NeroToggleSwitch'

export default {
  name: 'ApplicationDetails',
  components: {
    RuleLabel,
    NeroButton,
    NeroFallbackThumbnail,
    NeroInput,
    NeroToggleSwitch
  },
  directives: {
    'click-outside': clickoutside
  },
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
        this.application.exportTeacher)
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
    if (this.application.rules === undefined || this.application.rules.length === 0) {
      this.$store.dispatch('applicationManager/getApplicationBroadcastScope', {
        school: this.$store.state.administration.selectedSchool
      })
    }
    if (this.application.roleList === undefined) {
      this.$store.dispatch('applicationManager/getApplicationDefaultRoleList')
    }
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
      var confirmParams = {
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
@import 'src/assets/css/constants';

.details {
  display: flex;
  padding: 7px;
  width: 345px;
  position: absolute;
  background: $toolbar-background-color;
  z-index: 3;
  border-radius: $border-radius;
  @extend %nero-shadow;
}

.left {
  right: 0;
}

.logo {
  width: 70px;
  height: 70px;
  margin-right: 5px;
  font-size: 53px;
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

.action {
  margin-left: auto;
  display: flex;
  flex-direction: column;
}
</style>
