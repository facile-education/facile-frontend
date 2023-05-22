<template>
  <div
    class="placeholder"
    :class="{'theme-border-color' : dragover}"
    @dragover.prevent="dragover=true"
    @dragleave="dragover=false"
    @drop="drop"
  >
    <span v-t="'noAccess'" />
    <!--    <em-->
    <!--      v-t="'createAccess'"-->
    <!--      @click="$emit('createAccess')"-->
    <!--    />-->
  </div>
</template>

<script>
export default {
  name: 'AccessesPlaceholder',
  props: {
    parentCategory: {
      type: Object,
      required: true
    }
  },
  emits: ['createAccess'],
  data () {
    return {
      dragover: false
    }
  },
  computed: {
    categoryList () {
      return this.$store.state.accessManager.categoryList
    },
    draggedAccess () {
      return this.$store.state.accessManager.draggedAccess
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

        // Insert him in the good place in new category
        const newCategory = newCategoryList[this.parentCategory.position]
        newCategory.accessList.splice(0, 0, { ...this.draggedAccess })
        // Recompute new category positions
        for (let index = 0; index < newCategory.accessList.length; index++) {
          newCategory.accessList[index].position = index
        }

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
  margin-top: 5px;
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

<i18n locale="fr">
{
  "noAccess": "Aucun accès",
  "createAccess": "Ajoutez un accès"
}
</i18n>
