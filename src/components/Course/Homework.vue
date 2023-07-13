<template>
  <div class="homework">
    <div class="title">
      <section>
        <h3>{{ homework.title }} - {{ homework.estimatedTime }}</h3>
        <span class="theme-text-color">Réalisé par {{ homework.doneStudents.length }} élèves on {{ homework.selectedStudents.length }}</span>
      </section>
      <section class="right">
        <span>Donné le {{ homework.publicationDate }} (modifié le {{ homework.modificationDate }})</span>
        <img
          height="20"
          width="20"
          :src="require('@/assets/icons/vertical_dots.svg')"
          @click="openHomeworkEditModal"
        >
      </section>
    </div>
    <Content
      v-for="block in homework.blocks"
      :key="block.contentId"
      v-model="block.contentValue"
      :content="block"
    />
  </div>
  <teleport to="body">
    <HomeworkEditModal
      v-if="isHomeworkModalDisplayed"
      :edited-homework="homework"
      @close="isHomeworkModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const Content = defineAsyncComponent(() => import('@/components/Course/Content'))
const HomeworkEditModal = defineAsyncComponent(() => import('@/components/Course/HomeworkEditModal'))

export default {
  name: 'Homework',
  components: { Content, HomeworkEditModal },
  props: {
    homework: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isHomeworkModalDisplayed: false
    }
  },
  methods: {
    openHomeworkEditModal () {
      this.isHomeworkModalDisplayed = true
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
