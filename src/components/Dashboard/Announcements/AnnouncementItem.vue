<template>
  <div class="container">
    <div
      class="announcement"
      :class="{'theme-border-color': !announcement.hasRead}"
      tabindex="0"
      @click="showDetails"
    >
      <div class="thumbnail">
        <img
          :src="announcement.thumbnailUrl"
          alt="thumbnail"
        >
      </div>

      <div
        class="content"
        :title="announcement.title"
      >
        <strong class="title">
          {{ announcement.title }}
        </strong>
        <div
          class="description"
          v-html="announcement.content"
        />
        <div class="meta-data">
          <span>{{ announcementDay }}</span>
          <span>{{ $t('by') + announcement.authorName }}</span>
          <BaseIcon
            class="paper-clip"
            name="paperclip"
          />
        </div>
      </div>

      <div
        v-if="!announcement.hasRead"
        class="pellet theme-background-color"
      />
    </div>
  </div>
</template>

<script>
import { deleteNews, setNewsRead } from '@/api/news.service'
import dayjs from 'dayjs'
import BaseIcon from '@components/Base/BaseIcon.vue'

export default {
  name: 'AnnouncementItem',
  components: { BaseIcon },
  props: {
    announcement: {
      type: Object,
      required: true
    }
  },
  emits: ['deleteAnnouncement', 'updateAnnouncement'],
  data () {
    return {
      isUpdateModalDisplayed: false,
      isDetailsModalDisplayed: false
    }
  },
  computed: {
    announcementDay () {
      return this.$t('at') + dayjs(this.announcement.publicationDate).format('DD-MM-YY')
    }
  },
  methods: {
    showDetails () {
      if (!this.announcement.hasRead) {
        this.markAnnouncementAsRead()
      }
      this.isDetailsModalDisplayed = true
    },
    updateAnnouncement () {
      this.$emit('updateAnnouncement')
    },
    markAnnouncementAsRead () {
      setNewsRead(this.announcement.newsId, true).then((data) => {
        if (data.success) {
          this.$emit('updateAnnouncement')
        } else {
          console.error('Error')
        }
      })
    },
    confirmDeleteAnnouncement () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('removalConfirmMessage'),
        lastAction: { fct: this.deleteAnnouncement, params: [] }
      })
    },
    deleteAnnouncement () {
      deleteNews(this.announcement.newsId).then((data) => {
        if (data.success) {
          this.$emit('deleteAnnouncement')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-right: 4px;
  padding-top: 4px;
  //border: 1px solid;
}

.announcement {
  position: relative;
  cursor: pointer;
  height: 106px;
  width: 323px;
  border-radius: 5px;
  background-color: #F4F8FF;
  padding: 4px;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  --thumbnail-width: 70px;
  border: 1px solid #FFDDDD;

  .pellet {
    --pellet_size: 16px;
    height: var(--pellet_size);
    width: var(--pellet_size);
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 100%;
    transform: translate(-75%, -25%);
  }
}

.thumbnail{
  width: var(--thumbnail-width);
  height: 100%;
  background-color: green;
}

.content {
  width: calc(100% - var(--thumbnail-width));
  // TODO: find a way to remove following lines
  display: flex;
  flex-direction: column;
  justify-content: center;

  .description, .meta-data {
    font-size: 12px;
  }

  .title, .description, .meta-data {
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
}

.paper-clip {
  margin-left: 1em;
}

</style>

<i18n locale="fr">
{
  "at": "Le ",
  "by": " par ",
  "removalConfirmMessage": "L'Annonce sera définitivement perdue"
}
</i18n>
