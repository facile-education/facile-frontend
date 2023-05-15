<template>
  <div class="category">
    <div
      v-if="!isNameModification"
      class="category-name"
    >
      <h2 class="title">
        {{ category.categoryName }}
      </h2>

      <div class="options">
        <button
          class="option"
          @click.stop="isNameModification = true"
        >
          <img
            src="@/assets/icon_edit_texte.svg"
            alt="edit"
          >
        </button>
        <button
          class="option"
          @click.stop="confirmDeleteCategory"
        >
          <img
            src="@/assets/icon_trash.svg"
            alt="edit"
          >
        </button>
      </div>
    </div>

    <AccessCategoryInput
      v-else
      :initial-name="category.categoryName"
      @submitName="updateName"
      @close="isNameModification = false"
    />

    <ul v-if="category.accessList.length > 0">
      <li
        v-for="access in category.accessList"
        :key="access.title"
      >
        <AccessItem :access="access" />
      </li>
    </ul>
  </div>
</template>

<script>
import AccessItem from '@components/Accesses/AccessManager/AccessItem.vue'
import AccessCategoryInput from '@components/Accesses/AccessManager/AccessCategoryInput.vue'

export default {
  name: 'AccessCategoryItem',
  components: { AccessCategoryInput, AccessItem },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isNameModification: false
    }
  },
  computed: {
    categoryList () {
      return this.$store.state.accessManager.categoryList
    }
  },
  methods: {
    confirmDeleteCategory () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteCategoryWarning', { categoryName: this.category.categoryName }),
        lastAction: { fct: this.deleteCategory }
      })
    },
    updateName (name) {
      this.isNameModification = false

      if (name.length > 0) {
        // Deep copy categoryList
        const newCategoryList = JSON.parse(JSON.stringify(this.categoryList))
        // Modify the category name
        const categoryIndex = newCategoryList.map(category => category.categoryId).indexOf(this.category.categoryId)
        if (categoryIndex !== -1) {
          const category = newCategoryList[categoryIndex]
          category.categoryName = name
          // Save the new categoryList
          this.$store.dispatch('accessManager/setCategoryList', newCategoryList)
        } else {
          console.error("Can't find categoryId " + this.category.categoryId + ' in ', this.categoryList)
        }
      }
    },
    deleteCategory () {
      // Deep copy categoryList
      const newCategoryList = JSON.parse(JSON.stringify(this.categoryList))
      // Delete the category
      const categoryIndex = newCategoryList.map(category => category.categoryId).indexOf(this.category.categoryId)
      if (categoryIndex !== -1) {
        newCategoryList.splice(categoryIndex, 1)
        // Save the new categoryList
        this.$store.dispatch('accessManager/setCategoryList', newCategoryList)
      } else {
        console.error("Can't find categoryId " + this.category.categoryId + ' in ', this.categoryList)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

h2 {
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

ul {
  margin: 0 0 0 1rem;
  padding: 0;
  list-style-type: none;

  li {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.category-name {
  height: 50px;
  background-color: #01d801;
  position: relative;
  overflow: hidden;

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

<i18n locale="fr" >
{
  "deleteCategoryWarning": "Souhaitez-vous supprimer la catégorie {categoryName} et ses accès?"
}
</i18n>
