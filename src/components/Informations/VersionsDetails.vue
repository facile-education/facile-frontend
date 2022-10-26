<template>
  <div data-test="version-details">
    {{ $t('version') }} :
    <PentilaDropdown
      v-if="versionList"
      data-test="versionListDropDown"
      :model-value="selected"
      :list="sortedVersionList"
      :sort="false"
      display-field="versionNumber"
      @update:model-value="selectVersion"
    />
    <br>
    <p
      v-if="versionDetails"
      data-test="versionDetails"
      v-html="versionDetails"
    />
    <p
      v-else
    >
      Unable to get version details
    </p>
    <VersionEditionForm v-if="isAdministrator" />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const VersionEditionForm = defineAsyncComponent(() => import('@/components/Informations/VersionEditionForm'))

export default {
  name: 'VersionsDetails',
  components: { VersionEditionForm },
  data () {
    return {
      selected: undefined
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    versionList () {
      // this.selectedVersion(this.latestVersion) // we would like to update the selected version any times the version list change
      return this.$store.state.information.versionList
    },
    versionDetails () {
      return this.$store.state.information.versionDetails
    },
    sortedVersionList () {
      // TODO unit tests ?
      function compare (a, b) {
        // let's supposed that the version format is X.X.X.X
        const tabA = a.versionNumber.split('.')
        const tabB = b.versionNumber.split('.')

        for (let idx = 0; idx < tabA.length; ++idx) {
          if (tabA[idx] < tabB[idx]) { return 1 }
          if (tabA[idx] > tabB[idx]) { return -1 }
        }
        return 1
      }

      return this.versionList.slice().sort(compare)
    },
    latestVersion () {
      for (let idx = 0; idx < this.sortedVersionList.length; ++idx) {
        if (this.sortedVersionList[idx].latest === true) {
          return this.sortedVersionList[idx]
        }
      }
      return undefined
    }
  },
  created () {
    if (this.versionList === undefined) {
      this.$store.dispatch('information/getVersionList')
    }
  },
  methods: {
    selectVersion (version) {
      this.selected = version
      this.$store.dispatch('information/getVersionDetails', this.selected)
    }
  }
}
</script>

<style lang="scss" scoped>
.addVersion {
  float: right;
}

p {
  margin: 10px 0;
  padding: 25px;
  border: 1px solid #999;
}
</style>

<i18n locale="fr">
{
  "addVersionButtonLabel": "Ajouter une version",
  "addVersionButtonTitle": "InformationWindow.VersionDetails.addVersionButtonLabel",
  "version" : "Version"
}
</i18n>
