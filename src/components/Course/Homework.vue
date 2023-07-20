<template>
  <article class="homework">
    <header class="title">
      <div>
        <h3>{{ homework.title }} - {{ homework.estimatedTime }}</h3>
        <span class="theme-text-color">Réalisé par {{ homework.doneStudents.length }} élèves on {{ homework.selectedStudents.length }}</span>
      </div>
      <div class="right">
        <span>Donné le {{ homework.publicationDate }} (modifié le {{ homework.modificationDate }})</span>
        <button
          class="edit-button"
          :aria-label="$t('options')"
          :title="$t('options')"
          @click="toggleContextMenu"
        >
          <img
            height="20"
            width="20"
            :src="require('@/assets/icons/vertical_dots.svg')"
            alt="options"
          >
        </button>
      </div>
    </header>
    <Content
      v-for="block in homework.blocks"
      :key="block.contentId"
      v-model="block.contentValue"
      :content="block"
    />
  </article>
  <teleport to="body">
    <HomeworkEditModal
      v-if="isHomeworkModalDisplayed"
      :edited-homework="homework"
      @close="isHomeworkModalDisplayed = false"
    />
  </teleport>
  <teleport
    v-if="displayMenu"
    to="body"
  >
    <ContextMenu
      @choose-option="performChosenOption"
      @close="displayMenu=false"
    />
  </teleport>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import { deleteHomework } from '@/api/homework.service'
import { icons } from '@/constants/icons'

const Content = defineAsyncComponent(() => import('@/components/Course/Content'))
const HomeworkEditModal = defineAsyncComponent(() => import('@/components/Course/HomeworkEditModal'))
const ContextMenu = defineAsyncComponent(() => import('@/components/ContextMenu/ContextMenu'))

export default {
  name: 'Homework',
  components: { ContextMenu, Content, HomeworkEditModal },
  props: {
    homework: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isHomeworkModalDisplayed: false,
      displayMenu: false
    }
  },
  methods: {
    openHomeworkEditModal () {
      this.isHomeworkModalDisplayed = true
    },
    toggleContextMenu (event) {
      this.displayMenu = true
      this.$store.dispatch('contextMenu/openContextMenu', {
        event: event,
        options: [
          {
            name: 'edit',
            title: this.$t('edit'),
            icon: icons.options.rename,
            position: 1,
            hasSeparator: false
          },
          {
            name: 'delete',
            title: this.$t('delete'),
            icon: icons.options.delete,
            position: 2,
            hasSeparator: false
          }]
      })
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'edit':
          this.openHomeworkEditModal()
          break
        case 'delete':
          deleteHomework(this.homework.homeworkId).then((data) => {
            if (data.success) {
              this.$store.dispatch('course/updateSessionDetails')
            }
          })
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.displayMenu = false
      this.$store.dispatch('contextMenu/closeMenus')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.homework {
  display: flex;
  padding: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;

  border-radius: 0.375rem;
  border: 1px solid $neutral-40;
  background: $neutral-10;
}

.title {
  display: flex;
  align-items: center;
  align-content: flex-start;
  gap: 1rem 0.25rem;
  align-self: stretch;
  flex-wrap: wrap;
}

h3 {
  margin: 0;

  @extend %font-bold-l;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;

  @extend %font-regular-xs;
}
</style>

<i18n locale="fr">
{
  "delete": "Supprimer",
  "edit": "Modifier"
}
</i18n>
