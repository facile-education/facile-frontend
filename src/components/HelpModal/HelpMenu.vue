<template>
  <nav class="menu">
    <div
      v-if="!helpMenu && isLoadingMenu"
      v-t="'loading'"
      class="help-menu-placeholder"
    />

    <div
      v-else-if="!helpMenu"
      v-t="'helpMenuErrorPlaceholder'"
      class="help-menu-placeholder"
    />

    <div
      v-else-if="!isAdministrator && helpMenu.length === 0"
      v-t="'helpMenuEmptyPlaceholder'"
      class="help-menu-placeholder"
    />

    <ul v-else>
      <li v-if="isAdministrator">
        <WeprodeButton
          v-t="('createCategoryLabel')"
          data-test="create-category-button"
          class="create-category-button"
          :class="{'phone': mq.phone}"
          @click="isCreateCategoryModalDisplayed=true"
        />
      </li>
      <HelpMenuCategory
        v-for="(category, index) in helpMenu"
        :key="index"
        :category="category"
      />
    </ul>

    <WeprodeSpinner v-if="isLoadingMenu" />

    <teleport
      v-if="isCreateCategoryModalDisplayed"
      to="body"
    >
      <CreateCategoryModal @close="isCreateCategoryModalDisplayed=false" />
    </teleport>
  </nav>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import HelpMenuCategory from '@components/HelpModal/HelpMenuCategory.vue'
import { defineAsyncComponent } from 'vue'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
const CreateCategoryModal = defineAsyncComponent(() => import('@components/HelpModal/CreationModals/CreateCategoryModal.vue'))

export default {
  name: 'HelpMenu',
  components: { CreateCategoryModal, HelpMenuCategory, WeprodeButton, WeprodeSpinner },
  inject: ['mq'],
  data () {
    return {
      isCreateCategoryModalDisplayed: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    helpMenu () {
      return this.$store.state.help.helpMenu
    },
    isLoadingMenu () {
      return this.$store.getters['currentActions/isInProgress']('getHelpMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.menu {
  position: relative;
  overflow-y: auto;
}

.help-menu-placeholder{
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bold;
  text-align: center;
  padding-top: 10em;

}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.create-category-button {
  width: 100%;
}
</style>

<i18n locale="fr">
{
  "helpMenuErrorPlaceholder": "Aucun menu displonible",
  "helpMenuEmptyPlaceholder": "Aucun résultat",
  "createCategoryLabel": "+ Créer une catégorie",
  "loading": "Chargement..."
}
</i18n>
