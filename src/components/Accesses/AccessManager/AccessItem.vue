<template>
  <div class="access">
    <h3>
      {{ access.title }}
    </h3>
    <div class="options">
      <button
        class="option"
        @click.stop="isUpdateModalDisplayed = true"
      >
        <img
          src="@/assets/icon_edit_texte.svg"
          alt="edit"
        >
      </button>
      <button
        class="option"
        @click.stop="confirmDeleteAccess"
      >
        <img
          src="@/assets/icon_trash.svg"
          alt="edit"
        >
      </button>
    </div>
  </div>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveAccessModal
      :category-list="categoryList"
      :init-access="access"
      :init-category="parentCategory"
      @updateAccess="updateAccess"
      @close="isUpdateModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import SaveAccessModal from '@components/Accesses/AccessManager/SaveAccessModal.vue'

export default {
  name: 'AccessItem',
  components: { SaveAccessModal },
  props: {
    access: {
      type: Object,
      required: true
    },
    parentCategory: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isUpdateModalDisplayed: false
    }
  },
  computed: {
    categoryList () {
      return this.$store.state.accessManager.categoryList
    }
  },
  methods: {
    confirmDeleteAccess () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteAccessWarning', { accessName: this.access.title }),
        lastAction: { fct: this.deleteAccess }
      })
    },
    updateAccess (accessForm) {
      const access = accessForm.access
      const selectedCategory = accessForm.selectedCategory

      // Deep copy categoryList
      const newCategoryList = JSON.parse(JSON.stringify(this.categoryList))
      // Modify the access in category
      if (selectedCategory.position === this.parentCategory.position) { // If access not move from category update it
        const category = newCategoryList[this.parentCategory.position]
        access.position = this.access.position
        category.accessList.splice(this.access.position, 1, access)
      } else { // else, delete from old category and add in the new one in last position
        const oldCategory = newCategoryList[this.parentCategory.position]
        oldCategory.accessList.splice(this.access.position, 1)
        // Compute new positions
        for (let index = 0; index < oldCategory.accessList.length; index++) {
          oldCategory.accessList[index].position = index
        }
        const newCategory = newCategoryList[selectedCategory.position]
        access.position = newCategory.accessList.length
        newCategory.accessList.push(access)
      }
      // Save the new categoryList
      this.$store.dispatch('accessManager/setCategoryList', newCategoryList)
    },
    deleteAccess () {
      // Deep copy categoryList
      const newCategoryList = JSON.parse(JSON.stringify(this.categoryList))
      // Delete the access in category
      const category = newCategoryList[this.parentCategory.position]
      category.accessList.splice(this.access.position, 1)
      // Compute new positions
      for (let index = 0; index < category.accessList.length; index++) {
        category.accessList[index].position = index
      }
      // Save the new categoryList
      this.$store.dispatch('accessManager/setCategoryList', newCategoryList)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

h3 {
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.access {
  height: 50px;
  position: relative;
  overflow: hidden;
  border: 1px solid $color-border;
  border-radius: 6px;
  padding-left: 1rem;

  &:hover, &:focus-within {
    .options {
      transform: translateX(0);
    }
  }
}

.options {
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(100%);
  height: 100%;
  display: flex;
  border-radius: 0 5px 5px 0;
  transition: all .3s ease;

  .option {
    width: 40px;
    transition: all .3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: $color-hover-bg;
    }
  }
}
</style>

<i18n locale="fr">
{
  "deleteAccessWarning": "Souhaitez-vous supprimer l'accès {accessName} ?"
}
</i18n>
