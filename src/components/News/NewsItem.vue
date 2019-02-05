<template>
  <div
    class="news"
    @click="onShowDetails()"
  >
    <div
      v-if="!news.isActive"
      v-t="'News.NewsItem.inactiveStampLabel'"
      class="inactive-stamp"
    />
    <img
      v-if="hasThumbnail"
      class="thumbnail"
      :src="news.thumbnail.url"
    >
    <div
      v-else
      class="default-image fa fa-image"
    />
    <div class="text">
      <h5
        :class="{'high-priority': news.isHighPrio}"
        class="title"
      >
        {{ news.title }}
      </h5>
      <p class="content">
        {{ news.ellipsise }}
      </p>
      <p class="author theme-text-color">
        {{ news.author }} {{ news.date }}
        <i
          v-if="hasAttachment"
          class="fa fa-paperclip"
        />
      </p>
    </div>
    <div
      v-if="hasEditionRights"
      class="admin-actions"
    >
      <NeroButton
        :title="$t('News.NewsItem.editButtonTitle')"
        type="circle"
        icon="fa fa-pencil-alt"
        @click.stop="onEditNews"
      />
      <NeroButton
        :title="$t('News.NewsItem.deleteButtonTitle')"
        type="circle"
        icon="fa fa-trash"
        cls="cancel"
        @click.stop="onDeleteNews"
      />
    </div>
  </div>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroUtils from '@/utils/nero.utils'

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
  computed: {
    hasAttachment () {
      return (this.news.attachFiles !== undefined && this.news.attachFiles.length > 0)
    },
    hasEditionRights () {
      return (this.news.isAuthor || this.news.isEditor)
    },
    hasThumbnail () {
      return (this.news.thumbnail.url !== undefined)
    }
  },
  methods: {
    onEditNews () {
      this.$store.dispatch('news/openEditionModal', NeroUtils.JSON.deepCopy(this.news))
    },
    onDeleteNews () {
      console.log('delete')
      // TODO Confirm + delete action
    },
    onShowDetails () {
      this.$store.dispatch('news/openNewsModal', NeroUtils.JSON.deepCopy(this.news))
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

.inactive-stamp {
  position: absolute;
  left: 41%;
  padding: 0 5px;
  border: 3px $notif-background-color solid;
  border-radius: 8px;
  color: $notif-background-color;
  background-color: $background-white-color;
  font-weight: bolder;
  text-transform: uppercase;
  z-index: 1;
  opacity: .9;

  @include rotate(-15deg)
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
  padding-right: 5px;
  @include calc(width, '100% - #{$thumbnail-size}');
}

.title {
  padding-top: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0;

  &.high-priority {
    color: $text-color-priority;
  }
}

.content {
  position: relative;
  margin: 0;
  text-align: justify;
  max-height: 24px;
  line-height: 1.4;
  overflow: hidden;
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

  >>> .cancel {
    margin-top: 5px;
    display: block;
  }
}
</style>
