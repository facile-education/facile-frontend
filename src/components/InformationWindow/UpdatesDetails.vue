<template>
  <div>
    {{ $t('InformationWindow.UpdateDetails.version') }} :
    <NeroDropdown
      v-if="versionList"
      v-model="selectedVersion"
      :list="sortedVersionList"
      :sort="false"
      display-field="versionNumber"
    />
    <NeroButton
      v-if="isAdministrator"
      class="addVersion"
      :title="$t('InformationWindow.UpdateDetails.addVersionButtonTitle')"
      :label="$t('InformationWindow.UpdateDetails.addVersionButtonLabel')"
      @click="addVersion"
    />
    <br>
    <p
      v-if="versionDetails"
      v-html="versionDetails"
    />
    <p
      v-else
    >
      Unable to get version details
    </p>
  </div>
</template>

<script>
import NeroDropdown from '@/components/Nero/NeroDropdown'
import NeroButton from '@/components/Nero/NeroButton'

export default {
  name: 'UpdatesDetails',
  components: {
    NeroDropdown,
    NeroButton
  },
  data () {
    return {
      selected: undefined,
      selectLatestVersion: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    versionList () {
      console.log(' mise à jour de versionList !')
      // this.selectedVersion(this.latestVersion) // à chaque changement de VersionList, on aimerait mettre à jour la selectedVection
      return this.$store.state.information.versionList
    },
    versionDetails () {
      return this.$store.state.information.versionDetails
    },
    sortedVersionList () {
      // TODO sort with other key than versionId
      function compare (a, b) {
        if (a.versionId < b.versionId) { return 1 }
        if (a.versionId > b.versionId) { return -1 }
        return 0
      }

      return this.versionList.slice().sort(compare)
    },
    latestVersion () {
      for (var idx = 0; idx < this.sortedVersionList.length; ++idx) {
        if (this.sortedVersionList[idx].latest === true) {
          return this.sortedVersionList[idx]
        }
      }
      return undefined
    },
    selectedVersion: {
      get () {
        return this.selected
      },
      set (version) {
        if (this.versionList) {
          this.selected = version
          // Once we've selected a version, we want to get it details
          this.$store.dispatch('information/getVersionDetails', version)
        }
      }
    }
  },
  created () {
    if (this.versionList === undefined) {
      this.$store.dispatch('information/getVersionList')
    }
  },
  methods: {
    addVersion () {
      this.$store.dispatch('nero/openUpdateEditionModal')
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
