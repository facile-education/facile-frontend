<template>
  <ul>
    <li
      v-for="cluster in clusteredBlocks"
      :key="cluster"
    >
      <CourseContentItem
        v-if="cluster.contentType !== 'groupedBlocks'"
        v-model="cluster.contentValue"
        :content="cluster"
      />
      <ul
        v-else
        class="clustered-blocks"
      >
        <li
          v-for="block in cluster.blocks"
          :key="block.contentId"
        >
          <CourseContentItem :content="block" />
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import CourseContentItem from '@components/Course/CourseContentItem.vue'

import contentTypeConstants from '@/constants/contentTypeConstants'

export default {
  name: 'CourseContentBlocks',
  components: { CourseContentItem },
  props: {
    contentBlocks: {
      type: Array,
      required: true
    }
  },
  computed: {
    clusteredBlocks () {
      const clusteredBlocks = []
      for (let i = 0; i < this.contentBlocks.length; i++) {
        if (this.contentBlocks[i].contentType === contentTypeConstants.TYPE_TEXT_CONTENT) {
          clusteredBlocks.push(this.contentBlocks[i])
        } else {
          const groupedBlocks = []
          while (i < this.contentBlocks.length && (this.contentBlocks[i].contentType !== contentTypeConstants.TYPE_TEXT_CONTENT)) {
            groupedBlocks.push(this.contentBlocks[i])
            i++
          }
          i--
          clusteredBlocks.push({ contentType: 'groupedBlocks', blocks: groupedBlocks })
        }
      }
      return clusteredBlocks
    }
  }
}
</script>

<style lang="scss" scoped>

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.clustered-blocks {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
}

</style>
