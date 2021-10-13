<template>
  <div class="current-options">
    <OptionItem
      v-if="isCreateOptionDisplayed"
      :option="createOption"
      @optionClicked="emitOption(createOption)"
    />
    <OptionItem
      v-for="(option, index) in selectedDocumentsOptions"
      :key="index"
      :option="option"
      @optionClicked="emitOption"
    />
    <!-- TODO handle case when panel is open and we want to close it -->
    <!--    <OptionItem-->
    <!--      v-if="isDetailsOptionsDisplayed"-->
    <!--      :option="toggleDetailsOption"-->
    <!--      @optionClicked="handleOption(toggleDetailsOption)"-->
    <!--    />-->
  </div>
</template>

<script>
import OptionItem from '@components/Documents/OptionItem'
export default {
  name: 'Options',
  components: { OptionItem },
  props: {
    selectedDocumentsOptions: {
      type: Array,
      required: true
    }
  },
  emits: ['optionClicked'],
  data () {
    return {
      createOption: {
        title: this.$t('Commons.new'),
        name: 'new',
        img: require('@assets/options/icon_add.svg').default
      }
      // toggleDetailsOption: {
      //   title: this.$t('Documents.options.toggleDetailsLabel'),
      //   name: 'toggleDetails',
      //   img: require('@assets/options/icon_toggle_detail_panel.svg').default
      // }
    }
  },
  computed: {
    selectedDocuments () {
      return this.$store.state.documents.selectedEntities
    },
    isCreateOptionDisplayed () {
      return this.selectedDocumentsOptions.length === 0
    }
    // isDetailsOptionsDisplayed () {
    //   return this.$store.state.documents.isDocumentPanelDisplayed // Display option if the panel is display to close it
    // }
  },
  methods: {
    emitOption (option) {
      this.$emit('optionClicked', option)
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
