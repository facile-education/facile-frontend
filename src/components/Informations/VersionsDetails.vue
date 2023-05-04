<template>
  <div
    data-test="version-details"
    class="version-details"
    :class="{'phone': mq.phone}"
  >
    <div class="version-selection">
      <span>
        {{ $t('version') }} :
      </span>
      <PentilaDropdown
        v-if="versionList"
        data-test="versionListDropDown"
        :model-value="selected"
        :list="sortedVersionList"
        :sort="false"
        display-field="versionNumber"
        @update:model-value="selectVersion"
      />
    </div>
    <p
      v-if="versionDetails"
      class="content"
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
  inject: ['mq'],
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
      return this.$store.state.about.versionList
    },
    versionDetails () {
      return this.$store.state.about.versionDetails
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
      this.$store.dispatch('about/getVersionList')
    }
  },
  methods: {
    selectVersion (version) {
      this.selected = version
      this.$store.dispatch('about/getVersionDetails', this.selected)
    }
  }
}
</script>

<style lang="scss" scoped>
.version-details {

  .version-selection {
    display: flex;
    align-items: center;

    span {
      margin-right: 20px;
    }
  }

  .content {
    max-height: 50vh;
    overflow: auto;
  }

  p {
    margin: 10px 0;
    padding: 25px;
    border: 1px solid #999;
  }
}

.phone {
  .content {
    max-height: 65vh;
  }
}

</style>

<i18n locale="fr">
{
  "addVersionButtonLabel": "Ajouter une version",
  "addVersionButtonTitle": "InformationWindow.VersionDetails.addVersionButtonLabel",
  "version" : "Version"
}
</i18n>
