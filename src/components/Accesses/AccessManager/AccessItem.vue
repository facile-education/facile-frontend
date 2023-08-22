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

    <div class="content">
      <img
        class="thumbnail"
        :src="thumbnail"
        alt="thumbnail"
      >
      <div class="access-text">
        <h3>
          {{ access.title }}
        </h3>
        <div class="roles">
          {{ formattedRoleList }}
        </div>
      </div>
    </div>
    <div class="options">
      <button
        class="option"
        @click.stop="isUpdateModalDisplayed = true"
      >
        <img
          src="@/assets/icons/pencil.svg"
          alt="edit"
        >
      </button>
      <button
        class="option"
        @click.stop="confirmDeleteAccess"
      >
        <img
          src="@/assets/icons/trash.svg"
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
      @close="isUpdateModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import NeroIcon from '@components/Nero/NeroIcon.vue'
import { defineAsyncComponent } from 'vue'

import { removeSchoolAccess, saveSchoolAccess } from '@/api/access.service'
import { defaultImagesKeys } from '@/constants/icons'
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
    },
    formattedRoleList () {
      let result = this.$t('profiles')
      for (let i = 0; i < this.access.profiles.length; i++) {
        result += this.access.profiles[i].displayText
        if (i !== this.access.profiles.length - 1) {
          result += ' - '
        }
      }
      return result
    },
    selectedSchool () {
      return this.$store.state.accessManager.selectedSchool
    },
    thumbnail () {
      if (defaultImagesKeys.indexOf(this.access.thumbnailUrl) !== -1) {
        return new URL(`../../../assets/images/${this.access.thumbnailUrl}.png`, import.meta.url).href
      } else { // Returned url is a key for local default image
        return this.access.thumbnailUrl
      }
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
        let position = this.access.position + 1

        this.parentCategory.accessList.forEach(access => {
          if (access.accessId === this.draggedAccess.accessId) {
            // If the category do not change just take current access position
            position = this.access.position
          }
        })

        if (this.draggedAccess.accessId !== this.access.accessId) {
          saveSchoolAccess(this.selectedSchool.schoolId, { ...this.draggedAccess, categoryId: this.parentCategory.categoryId, position }).then((data) => {
            if (data.success) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('saveSuccess'), type: 'success' })
              this.$store.dispatch('accessManager/getSchoolAccesses') // Reload changes to assure to have the backend-data
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            }
          })
        }
      }
    },
    confirmDeleteAccess () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteAccessWarning', { accessName: this.access.title }),
        lastAction: { fct: this.deleteAccess }
      })
    },
    deleteAccess () {
      removeSchoolAccess(this.selectedSchool.schoolId, this.access.accessId).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('saveSuccess'), type: 'success' })
          this.$store.dispatch('accessManager/getSchoolAccesses') // Reload changes to assure to have the backend-data
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

h3 {
  height: 100%;
  margin: 0;
  font-weight: 500;
}

.access {
  height: 74px;
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

.content {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.thumbnail {
  height: 64px;
  width: 64px;
  min-width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 0.75rem;
}

.access-text {
  margin-left: 1rem;
  overflow: hidden;

  .roles {
    margin-top: 4px;
  }

  h3, .roles {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  flex-direction: column;
  border-radius: 0 5px 5px 0;
  transition: all .3s ease;

  .option {
    flex: 1;
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
  "deleteAccessWarning": "Souhaitez-vous supprimer l'accès {accessName} ?",
  "profiles": "Profils: ",
  "saveSuccess": "Accès mis à jour"
}
</i18n>
