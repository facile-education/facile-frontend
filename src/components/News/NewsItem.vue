<template>
  <div
    class="news"
    @click="onShowDetails()"
  >
    <img
      v-if="hasThumbnail()"
      class="thumbnail"
      :src="news.thumbnail.url"
    >
    <div
      v-else
      class="default-image fa fa-image"
    />
    <div class="text">
      <h5 class="title">
        {{ news.title }}
      </h5>
      <p class="content">
        {{ news.ellipsise }}
      </p>
      <div class="author theme-text-color">
        {{ news.author }} {{ news.date }}
      </div>
    </div>
    <div class="admin-actions">
      <NeroButton
        :title="$t('TODO')"
        type="circle"
        icon="fa fa-pencil-alt"
        @click="onEditNews"
      />
      <NeroButton
        :title="$t('TODO')"
        type="circle"
        icon="fa fa-trash"
        cls="cancel"
        @click="onDeleteNews"
      />
    </div>
  </div>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'

export default {
  name: 'NewsItem',
  components: {
    NeroButton
  },
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  methods: {
    hasThumbnail () {
      return (this.news.thumbnail.url !== undefined)
    },
    onEditNews () {
      console.log('edit')
      // TODO Stop propagation
    },
    onDeleteNews () {
      console.log('delete')
      // TODO Stop propagation
    },
    onShowDetails () {
      console.log('showDetails true')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

$thumbnail-size: 55px;

.news {
  position: relative;
  /* @include calc(width, '100% - 5px'); */
  width: 100%;
  padding: 5px;
  align-items: center;
  background-color: $background-white-color;
  border-radius: $border-radius;
  @extend %nero-shadow;

  &:hover {
    cursor: pointer;

    >>> .admin-actions {
      display: block;
    }
  }
}

.thumbnail {
  width: auto;
  max-width: $thumbnail-size;
  height: $thumbnail-size;
  border-radius: $border-radius;
}

.default-image {
  width: $thumbnail-size;
  height: $thumbnail-size;
  color: $text-color-fallback;
  border: 1px solid $text-color-fallback;
  padding: 5px;
  border-radius: 5px;
  font-size: 43px;
}

.text {
  padding-left: 10px;
  @include calc(width, '100% - #{$thumbnail-size}');
}

.title {
  padding-top: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0;
}

.content {
  position: relative;
  margin: 0;
  text-align: justify;
  max-height: 24px;
  line-height: 1.4;
  overflow: hidden;
  word-break: break-all;
  white-space: normal;
}

.author {
  margin-top: 5px;
  margin-bottom: 0;
}

.admin-actions {
  position: absolute;
  right: 10px;
  display: none;
}
</style>
