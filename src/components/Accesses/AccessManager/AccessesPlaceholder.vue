<template>
  <div
    class="placeholder"
    :class="{'theme-border-color' : dragover}"
    @dragover.prevent="dragover=true"
    @dragleave="dragover=false"
    @drop="drop"
  >
    <span v-t="'Accesses.AccessesPlaceholder.noAccess'" />
    <em
      v-t="'Accesses.AccessesPlaceholder.createAccess'"
      data-test="createAccess"
      @click="isSaveAccessModalDisplayed=true"
    />
  </div>

  <teleport
    v-if="isSaveAccessModalDisplayed"
    to="body"
  >
    <SaveAccessModal
      :init-category="parentCategory"
      @close="isSaveAccessModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import { saveSchoolAccess } from '@/api/access.service'
const SaveAccessModal = defineAsyncComponent(() => import('@components/Accesses/AccessManager/SaveAccessModal.vue'))

export default {
  name: 'AccessesPlaceholder',
  components: {
    SaveAccessModal
  },
  props: {
    parentCategory: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dragover: false,
      isSaveAccessModalDisplayed: false
    }
  },
  computed: {
    categoryList () {
      return this.$store.state.accessManager.categoryList
    },
    draggedAccess () {
      return this.$store.state.accessManager.draggedAccess
    },
    selectedSchool () {
      return this.$store.state.accessManager.selectedSchool
    }
  },
  methods: {
    drop () {
      if (this.draggedAccess) {
        // Deep copy categoryList
        const newCategoryList = JSON.parse(JSON.stringify(this.categoryList))

        // Delete the dropped access from old category
        const oldCategory = newCategoryList[this.draggedAccess.parentCategoryPosition]
        oldCategory.accessList.splice(this.draggedAccess.position, 1)
        // Recompute old category positions
        for (let index = 0; index < oldCategory.accessList.length; index++) {
          oldCategory.accessList[index].position = index
        }

        saveSchoolAccess(this.selectedSchool.schoolId, { ...this.draggedAccess, categoryId: this.parentCategory.categoryId, position: 0 }).then((data) => {
          if (data.success) {
            console.log(this.parentCategory)
            this.$store.dispatch('popups/pushPopup', { message: this.$t('saveSuccess'), type: 'success' })
            this.$store.dispatch('accessManager/getSchoolAccesses') // Reload changes to assure to have the backend-data
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          }
        })

        // Save the new categoryList
        this.$store.commit('accessManager/setDraggedAccess', undefined)
        this.$store.dispatch('accessManager/setCategoryList', newCategoryList)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.placeholder {
  margin-left: 30px;
  margin-top: 10px;
  height: 10vh;
  width: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  text-align: center;
  border: 1px solid $color-border;
  border-radius: 6px;
}

em {
  // TODO: Uniform placeholder style with progression
  font-size: 0.9rem;
  margin-top: 3px;
  cursor: pointer;
  color: $color-link;
  text-decoration: underline;
  font-style: normal;
  font-weight: 600;
}

.theme-border-color {
  border: 2px solid;
}
</style>
