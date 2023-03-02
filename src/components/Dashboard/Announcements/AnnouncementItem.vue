<template>
  <div class="announcement-thumbnail-wrapper">
    <img
      v-if="announcement.thumbnail && announcement.thumbnail.url"
      class="announcement-thumbnail"
      :src="announcement.thumbnail.url"
      alt="thumbnail"
    >
  </div>

  <div class="announcement-other">
    <span class="announcement-title">{{ announcement.title }}</span>
    <span class="announcement-content">{{ announcement.ellipsise }}</span>

    <div class="announcement-info">
      <span class="author">
        {{ announcement.author }}
      </span>
      <span class="date">
        - {{ convertDateStr(announcement.publicationDate) }}
      </span>
      <i
        v-if="announcement.hasAttachFiles"
        class="fa fa-paperclip theme-color"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnnouncementItem',
  props: {
    announcement: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
