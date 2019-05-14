<template>
  <div>
    {{ $t('InformationWindow.UpdateDetails.version') }} :
    <!-- TODO afficher les updates dans le bon ordre -->
    <NeroDropdown
      :list="testList"
      display-field="text"
      @dropdown-select="versionSelected"
    />
    <NeroDropdown
      :list="versionList"
      display-field="versionNumber"
      @dropdown-select="selectedVersion"
    />
    <NeroDropdown
      v-if="selectedVersionBis"
      v-model="selectedVersionBis"
      :list="versionList"
      display-field="versionNumber"
    />
    <NeroButton
      class="addVersion"
      :title="$t('InformationWindow.UpdateDetails.addVersionButtonTitle')"
      :label="$t('InformationWindow.UpdateDetails.addVersionButtonLabel')"
      @click="addVersion"
    />
    <br>
    <p> {{ versionDetails }} </p>
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
      testList: [
        { text: 'Un', value: 'A' },
        { text: 'Deux', value: 'B' },
        { text: 'Trois', value: 'C' }
      ],
      text: "Ceci est le détail d'une version",
      applicationTest: undefined
    }
  },
  computed: {
    versionList () {
      return this.$store.state.updates.versionList
    },
    versionDetails () {
      return this.$store.state.updates.versionDetails
    },
    selectedVersionBis: {
      get () {
        // recherche dans la liste des version si il y en a une qui correspond à application.versionId
        if (this.versionList) {
          return this.applicationTest
        }
        return undefined
      },
      // set application.versionId à la valeur courante du dropdown (que lors d'une sélection?)
      set (value) {
        this.applicationTest = value
      }
    },
    selectedVersionTer (version) {
      if (this.versionList) {
        console.log(version.versionNumber)
        return version
      } else {
        return undefined
      }
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
    versionSelected (version) {
      console.log(version.value)
      return version.value
    },
    selectedVersion (version) {
      if (this.versionList) {
        // On donne à présent l'ordre de récupérer le contenu de la version
        this.$store.dispatch('updates/getVersionDetails', version) // (à encapsuler dans une méthode?)
        console.log(version.versionNumber)
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
