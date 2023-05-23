<template>
  <PentilaDropdown
    v-model="selectedRole"
    :list="roleList"
    :placeholder="$t('seeAs')"
    display-field="displayText"
    @update:modelValue="isAccessVisualizationOpen=true"
  />

  <teleport
    v-if="isAccessVisualizationOpen"
    to="body"
  >
    <AccessModal
      :init-category-list="filteredCategoryList"
      :concerned-role="selectedRole"
      @close="closeAccessModal"
    />
  </teleport>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const AccessModal = defineAsyncComponent(() => import('@components/Accesses/AccessVisualization/AccessModal.vue'))

export default {
  name: 'SeeAccessesAs',
  components: { AccessModal },
  data () {
    return {
      selectedRole: undefined,
      isAccessVisualizationOpen: false
    }
  },
  computed: {
    roleList () {
      return this.$store.state.accessManager.roleList
    },
    filteredCategoryList () {
      if (this.selectedRole.roleId !== -1) {
        return this.$store.getters['accessManager/filteredCategoryList'](this.selectedRole)
      } else {
        return []
      }
    }
  },
  methods: {
    closeAccessModal () {
      this.selectedRole = undefined
      this.isAccessVisualizationOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "seeAs": "Voir en tant que"
}
</i18n>
