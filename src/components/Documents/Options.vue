<template>
  <div class="current-options">
    <OptionItem
      v-if="isCreateOptionDisplayed"
      :option="createOption"
      @optionClicked="handleOption(createOption)"
    />
    <OptionItem
      v-for="(option, index) in selectedDocumentsOptions"
      :key="index"
      :option="option"
      @optionClicked="handleOption"
    />
    <OptionItem
      v-if="isDetailsOptionsDisplayed"
      :option="toggleDetailsOption"
      @optionClicked="handleOption(toggleDetailsOption)"
    />
  </div>
</template>

<script>
import OptionItem from '@components/Documents/OptionItem'
export default {
  name: 'Options',
  components: { OptionItem },
  data () {
    return {
      createOption: {
        title: this.$t('Commons.new'),
        name: 'new',
        img: require('@assets/options/icon_add.svg').default
      },
      toggleDetailsOption: {
        title: this.$t('Documents.toggleDetailsLabel'),
        name: 'toggleDetails',
        img: require('@assets/options/icon_toggle_detail_panel.svg').default
      }
    }
  },
  computed: {
    selectedDocuments () {
      return this.$store.state.documents.selectedFiles
    },
    isCreateOptionDisplayed () {
      return this.selectedDocuments.length === 0
    },
    selectedDocumentsOptions () {
      // TODO compute options
      return []
    },
    isDetailsOptionsDisplayed () {
      return this.selectedDocuments.length === 1 || this.$store.state.documents.isDocumentPanelDisplayed // Display option if the panel is display to close it
    }
  },
  methods: {
    handleOption (option) {
      // TODO handle options
      console.log(option)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.current-options {
  border-bottom: 1px solid $color-border;
  display: flex;
  align-items: center;
}

</style>
