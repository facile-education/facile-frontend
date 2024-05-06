<template>
  <ul
    v-if="homeworkList && homeworkList.length > 0"
    class="homework-list"
  >
    <li
      v-for="homework in homeworkList"
      :key="homework.homeworkId"
    >
      <Homework
        :homework="homework"
        :homework-type="homeworkType"
        :is-in-list="isInList"
        @update-homework="$emit('update-homework')"
      />
    </li>
  </ul>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const Homework = defineAsyncComponent(() => import('@/components/Course/Homework'))

export default {
  name: 'HomeworkList',
  components: { Homework },
  props: {
    homeworkType: {
      type: String,
      required: true
    },
    homeworkList: {
      type: Array,
      required: true
    },
    isInList: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update-homework']
}
</script>

<style lang="scss" scoped>

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
}

</style>
