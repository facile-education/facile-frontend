<template>
  <div>
    {{ $t('InformationWindow.UpdateDetails.version') }} :
    <!-- TODO afficher les updates dans le bon ordre -->
    <NeroDropdown
      v-if="versionList"
      :list="versionList"
      display-field="versionNumber"
      @dropdown-select="selectedVersion"
    />
    <NeroButton
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
  computed: {
    versionList () {
      return this.$store.state.updates.versionList
    },
    versionDetails () {
      return this.$store.state.updates.versionDetails
    }
  },
  created () {
    if (this.versionList === undefined) {
      this.$store.dispatch('updates/getVersionList')
    }
  },
  methods: {
    addVersion () {
      this.$store.dispatch('nero/openUpdateEditionModal')
    },
    selectedVersion (version) {
      if (this.versionList) {
        // On donne à présent l'ordre de récupérer le contenu de la version
        this.$store.dispatch('updates/getVersionDetails', version) // (à encapsuler dans une méthode?)
        return version
      } else {
        return undefined
      }
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
