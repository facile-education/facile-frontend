<template>
  <PentilaWindow
    :modal="true"
    :important="news.isHighPrio"
    @close="closeModal"
  >
    <div slot="header">
      <div
        v-if="news.isHighPrio"
        class="bell-icon"
      >
        <i class="fas fa-bell" />
      </div>
      <span
        v-t="'News.NewsModal.modalHeaderLabel'"
      />
    </div>

    <div slot="body">
      <div class="news-header">
        <img
          v-if="hasThumbnail"
          class="thumbnail"
          :src="news.thumbnail.url"
        >
        <div class="news-data">
          <h4 class="title">
            {{ news.title }}
          </h4>
          <p
            v-t="{ path: 'News.NewsModal.writtenBy', args: { author: news.author } }"
            class="author"
          />
          <div class="date">
            {{ news.date }}
          </div>
          <PentilaButton
            :title="$t('News.NewsItem.editButtonTitle')"
            type="circle"
            icon="fa fa-users"
            class="groups"
            @click="onToggleGroupList"
          />
          <div class="group-list">
            <ul v-if="showGroupList">
              <li
                v-for="group in news.broadcastedGroups"
                :key="group.groupId"
              >
                <a :href="group.newsUrl">
                  {{ group.groupName }} -- {{ group.isMember }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr class="separator">
      <p
        class="content"
        v-html="news.content"
      />
      <NeroAttachmentList :attachment-list="news.attachFiles" />
    </div>
    <div slot="footer">
      <PentilaButton
        v-if="hasEditionRights"
        :title="$t('News.NewsItem.editButtonTitle')"
        type="circle"
        icon="fa fa-pencil-alt"
        @click="onEditNews"
      />
    </div>
  </PentilaWindow>
</template>

<script>
import NeroAttachmentList from '@/components/NeroAttachment/NeroAttachmentList'

export default {
  name: 'NewsDelegationModal',
  components: {
    NeroAttachmentList
  },
  data () {
    return {
      showGroupList: false
    }
  },
  computed: {
    hasEditionRights () {
      return (this.news.isAuthor || this.news.isEditor)
    },
    hasThumbnail () {
      return (this.news.thumbnail.url !== undefined)
    },
    news () {
      return this.$store.state.news.selectedNews
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('news/closeNewsModal')
    },
    onEditNews () {
      this.$store.dispatch('news/openEditionModal')
    },
    onToggleGroupList () {
      console.log('onToggleGroupList')
      if (this.news.broadcastedGroups === undefined) {
        this.$store.dispatch('news/getSelectedNewsGroupList', this.news.blogEntryInfosId)
      }
      this.showGroupList = !this.showGroupList
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';
$thumbnail-size: 100px;

.news-header {
  position: relative;
}

.bell-icon {
  position: absolute;
  background-color: $text-color-priority;
  border-radius: 50%;
  width: 50px;
  font-size: 35px;
  top: -12px;
  left: 5%;
}

.thumbnail {
  width: $thumbnail-size;
  border-radius: $border-radius;
  padding-right: 5px;
}

.news-data {
  display: inline-block;
  vertical-align: top;
  @include calc(max-width, '100% - #{$thumbnail-size}');
}

.title {
  margin: 0;
}

.author {
  margin: 0;
}

.groups {
  position: absolute;
  right: 0;
  bottom: 0;
}

.separator {
  margin-top: 5px;
  border: $border;
}
</style>
