<template>
  <div>
    {{ $t('InformationWindow.UpdateDetails.version') }} :
    <!-- TODO afficher les updates dans le bon ordre -->
    <NeroDropdown
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
    <p> {{ text }} </p>
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
      text: "Ceci est le détail d'une version"
    }
  },
  computed: {
    versionList () {
      return this.$store.state.updates.versionList
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
    padding: 5px;
    border: 1px solid #999;
}

</style>
