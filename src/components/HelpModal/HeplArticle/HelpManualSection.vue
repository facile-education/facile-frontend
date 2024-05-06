<template>
  <section class="manual-section">
    <div class="header">
      <h3 v-t="'HelpModal.HelpManualSection.manual'" />
      <button
        v-if="isAdministrator"
        v-t="'HelpModal.HelpManualSection.edit'"
        @click="isEditManualModalDisplayed=true"
      />
    </div>
    <div
      ref="htmlContent"
      class="html-content"
      :class="{'folded': isFolded}"
      v-html="htmlContent"
    />
    <button
      v-if="isFoldable"
      class="toggle-fold-button"
      @click="toggleFold"
    >
      {{ isFolded ? $t('HelpModal.HelpManualSection.showMore') : $t('HelpModal.HelpManualSection.showLess') }}
    </button>

    <teleport
      v-if="isEditManualModalDisplayed"
      to="body"
    >
      <EditManualModal
        :html-content="htmlContent"
        @close="isEditManualModalDisplayed=false"
      />
    </teleport>
  </section>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const EditManualModal = defineAsyncComponent(() => import('@components/HelpModal/CreationModals/EditManualModal.vue'))
const maxFoldedContentHeight = 150 // px
export default {
  name: 'HelpManualSection',
  components: { EditManualModal },
  props: {
    htmlContent: {
      type: String,
      required: true
    },
    hasFaq: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isFoldable: undefined,
      isFolded: undefined,
      isEditManualModalDisplayed: false,
      isFoldAction: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    }
  },
  mounted () { // Not triggered when item selection change
    const htmlContentHeight = this.$refs.htmlContent.offsetHeight
    this.isFoldable = this.hasFaq && htmlContentHeight >= maxFoldedContentHeight
    this.isFolded = this.isFoldable
    // console.log('mounted: ', this.isFoldable, this.$refs.htmlContent.offsetHeight)
  },
  updated () { // Updates everytime Dom change, so when item selection change
    if (!this.isFoldAction) {
      const htmlContentHeight = this.$refs.htmlContent.offsetHeight
      this.isFoldable = this.hasFaq && htmlContentHeight >= maxFoldedContentHeight
      this.isFolded = this.isFoldable
      // console.log('domUpdated: ', this.isFoldable, this.$refs.htmlContent.offsetHeight)
    }
    this.isFoldAction = false
  },
  methods: {
    toggleFold () {
      this.isFoldAction = true
      this.isFolded = !this.isFolded
    }
  }
}
</script>

<style lang="scss">
.html-content {
  img {
    max-width: 100%;
    vertical-align: middle;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";
button {
  margin-top: 1em;
  display: none;
}

.header {
  width: 100%;
  align-items: center;
  display: flex;

  &:hover {
    button {
      display: block;
    }
  }
}

h3 {
  flex: 1;
  border-bottom: 1px solid $color-border;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 1em;
  margin-bottom: 0;
}

.folded {
  max-height: 150px;
  overflow-y: hidden;
  position: relative;

  &:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 20%;
    width: 100%;
    background-image: linear-gradient(to bottom, transparent, white);
  }
}

.toggle-fold-button {
  width: 100%;
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  height: 26px;
  border: none;
  border-top: 1px solid $color-border;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: lighter;
  font-size: 0.75em;
  color: $color-grey-text;

  &:hover {
    background-color: $color-hover-bg;
  }
}
</style>
