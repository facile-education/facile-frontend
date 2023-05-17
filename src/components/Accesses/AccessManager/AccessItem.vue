<template>
  <div
    class="access"
    :class="{'droppable': draggedAccess && !isDragged}"
    :draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @dragover.prevent="dragOver"
    @dragleave="dragLeave"
    @drop="drop"
  >
    <hr class="drag-placeholder theme-border-color">

    <div class="content-move">
      <NeroIcon
        name="grip-lines"
        class="icon"
      />
    </div>

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

import NeroIcon from '@components/Nero/NeroIcon.vue'
import { defineAsyncComponent } from 'vue'
const SaveAccessModal = defineAsyncComponent(() => import('@components/Accesses/AccessManager/SaveAccessModal.vue'))

export default {
  name: 'AccessItem',
  components: { NeroIcon, SaveAccessModal },
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
      isUpdateModalDisplayed: false,
      isDragged: false
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
    dragLeave (e) {
      e.target.classList.remove('top')
      e.target.classList.remove('bottom')
    },
    dragOver (e) {
      if (this.draggedAccess && this.draggedAccess.parentCategoryPosition === this.parentCategory.position && this.draggedAccess.position !== this.access.position) {
        if (this.access.position < this.draggedAccess.position) {
          e.target.classList.add('top')
        } else {
          e.target.classList.add('bottom')
        }
      } else if (this.draggedAccess && this.draggedAccess.parentCategoryPosition !== this.parentCategory.position) {
        e.target.classList.add('bottom')
      }
    },
    dragStart () {
      this.isDragged = true
      const accessToDrop = { ...this.access, parentCategoryPosition: this.parentCategory.position }
      this.$store.commit('accessManager/setDraggedAccess', accessToDrop)
    },
    dragEnd () {
      this.isDragged = false
      this.$store.commit('accessManager/setDraggedAccess', undefined)
    },
    drop () {
      if (this.draggedAccess) {
        // Deep copy categoryList
        const newCategoryList = JSON.parse(JSON.stringify(this.categoryList))

        if (this.draggedAccess.parentCategoryPosition === this.parentCategory.position && this.draggedAccess.position !== this.access.position) {
          // Delete the dropped access from accessList
          const category = newCategoryList[this.draggedAccess.parentCategoryPosition]
          category.accessList.splice(this.draggedAccess.position, 1)
          // Insert him in the good place
          category.accessList.splice(this.access.position, 0, { ...this.draggedAccess })
          // Recompute category positions
          for (let index = 0; index < category.accessList.length; index++) {
            category.accessList[index].position = index
          }
        } else if (this.draggedAccess.parentCategoryPosition !== this.parentCategory.position) {
          // Delete the dropped access from old category
          const oldCategory = newCategoryList[this.draggedAccess.parentCategoryPosition]
          oldCategory.accessList.splice(this.draggedAccess.position, 1)
          // Recompute old category positions
          for (let index = 0; index < oldCategory.accessList.length; index++) {
            oldCategory.accessList[index].position = index
          }

          // Insert him in the good place in new category
          const newCategory = newCategoryList[this.parentCategory.position]
          newCategory.accessList.splice(this.access.position + 1, 0, { ...this.draggedAccess })
          // Recompute new category positions
          for (let index = 0; index < newCategory.accessList.length; index++) {
            newCategory.accessList[index].position = index
          }
        }
        // Save the new categoryList
        this.$store.dispatch('accessManager/setCategoryList', newCategoryList)
        this.$store.commit('accessManager/setDraggedAccess', undefined)
      }
    },
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
  font-size: 1.2rem;
  font-weight: 500;
}

.access {
  height: 50px;
  position: relative;
  border: 1px solid $color-border;
  border-radius: 6px;
  padding-left: 1rem;

  &:hover, &:focus-within {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    .options {
      opacity: 100%;

      .option {
        width: 40px;
      }
    }

    .content-move {
      opacity: 1;
      transition: .3s;
      left: -30px;
      width: 30px;
    }
  }

  &.droppable * {
    pointer-events: none;
  }

  &.top .drag-placeholder {
    border-top: 2px solid;
    top: -7px;
  }

  &.bottom .drag-placeholder {
    border-bottom: 2px solid;
    bottom: -7px;
  }
}

.drag-placeholder {
  position: absolute;
  left: 0;
  width: 100%;
  margin: 0;
  border: none;
}

.content-move {
  position: absolute;
  height: calc(100% + 2px);
  width: 0;
  top: -1px;
  left: 0;
  background: $color-not-white-bg;
  border: 1px solid $color-border;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  border-right: none;
  display: flex;
  cursor: move;
  opacity: 0;

  .icon {
    margin: auto
  }
}

.options {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
  opacity: 0;
  display: flex;
  border-radius: 0 5px 5px 0;
  transition: all .3s ease;

  .option {
    width: 0;
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
