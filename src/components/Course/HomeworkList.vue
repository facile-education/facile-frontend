<template>
  <div class="homework-list">
    <h4>{{ header }}</h4>
    <ul v-if="homeworkList && homeworkList.length > 0">
      <li
        v-for="homework in homeworkList"
        :key="homework.homeworkId"
      >
        <Homework :homework="homework" />
      </li>
    </ul>
    <div
      v-else
      class="placeholder"
    >
      {{ placeholder }}
      <strong>{{ ' ' + header }}</strong>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const Homework = defineAsyncComponent(() => import('@/components/Course/Homework'))

export default {
  name: 'HomeworkList',
  components: { Homework },
  props: {
    header: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    homeworkList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

h4 {
  margin: 1rem 0;
  line-height: normal;
  @extend %font-regular-xs;
}

.placeholder {
  @extend %content-placeholder;
}

</style>
