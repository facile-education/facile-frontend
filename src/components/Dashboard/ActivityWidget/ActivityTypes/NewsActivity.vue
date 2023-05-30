<template>
  <div
    class="news-activity"
    tabindex="0"
    @click="displayDetails"
    @keyup.enter="displayDetails"
  >
    <div class="icon">
      <img
        class="img-icon"
        :src="thumbnail"
        alt="document icon"
      >
    </div>

    <div class="content">
      <div class="author">
        <span>
          {{ news.groupName + ' - ' + news.authorName }}
        </span>
      </div>
      <div class="description">
        <div class="left">
          <span class="text">
            {{ news.title }}
          </span>
          <BaseIcon
            v-if="news.hasAttachedFiles"
            class="paper-clip"
            name="paperclip"
          />
        </div>
        <i v-t="'see'" />
      </div>
    </div>

    <div class="date">
      {{ formattedDate }}
    </div>

    <div
      v-if="news.isEditable"
      class="options"
    >
      <button
        class="option"
        :aria-label="$t('update')"
        @click.stop="isUpdateModalDisplayed = true"
      >
        <img
          src="@/assets/icon_edit_texte.svg"
          alt="edit"
        >
      </button>
      <button
        class="option"
        :aria-label="$t('delete')"
        @click.stop="confirmNewsDeletion"
      >
        <img
          src="@/assets/icon_trash.svg"
          alt="delete"
        >
      </button>
    </div>
  </div>

  <teleport
    v-if="isDetailsModalDisplayed"
    to="body"
  >
    <NewsActivityDetailsModal
      :init-news="news"
      @delete="$emit('deleteNews')"
      @update="$emit('updateNews')"
      @close="isDetailsModalDisplayed = false"
    />
  </teleport>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveNewsModal
      :init-news="news"
      @update="$emit('updateNews')"
      @close="isUpdateModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import dayjs from 'dayjs'
import validators from '@utils/validators'
import { defineAsyncComponent } from 'vue'
import { deleteNews } from '@/api/dashboard/news.service'
import BaseIcon from '@components/Base/BaseIcon.vue'
const SaveNewsModal = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/SaveNewsModal.vue'))
const NewsActivityDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/NewsActivityDetailsModal.vue'))

export default {
  name: 'NewsActivity',
  components: { BaseIcon, SaveNewsModal, NewsActivityDetailsModal },
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  emits: ['updateNews', 'deleteNews', 'displayDetails'],
  data () {
    return {
      isDetailsModalDisplayed: false,
      isUpdateModalDisplayed: false
    }
  },
  computed: {
    thumbnail () {
      if (validators.isValidURL(this.news.thumbnailUrl)) {
        return this.news.thumbnailUrl
      } else { // Returned url is a key for local default image
        return require('@assets/images/' + this.news.thumbnailUrl + '.png')
      }
    },
    formattedDate () {
      return dayjs(this.news.modificationDate, 'YYYY-MM-DD HH:mm').calendar()
    }
  },
  methods: {
    displayDetails () {
      this.isDetailsModalDisplayed = true
      this.$emit('displayDetails')
    },
    confirmNewsDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteNewsWarning'),
        lastAction: { fct: this.deleteNews }
      })
    },
    deleteNews () {
      deleteNews(this.news.newsId).then((data) => {
        if (data.success) {
          this.$emit('deleteNews')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

button {
  padding: 0
}

.news-activity {
  @extend %activity-item;
  cursor: pointer;
  position: relative;

  &:hover, &:focus-within {
    .options {
      opacity: 100%;

      .option {
        width: 40px;
      }
    }
  }

  .description {
    display: flex;
    justify-content: space-between;

    .left {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;

      .text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .paper-clip {
    color: $color-new-light-text;
    margin: 0 0.5rem;
  }

  i {
    margin: 0 0.5em;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 50%;
    }
  }

  .options {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    overflow: hidden;
    opacity: 0;
    display: flex;
    flex-direction: column;
    border-radius: 0 5px 5px 0;
    transition: all .3s ease;

    .option {
      flex: 1;
      width: 0;
      transition: all .3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;

      &:hover {
        background-color: $color-hover-bg;
      }
    }
  }
}

</style>

<i18n locale="fr">
{
  "see": "Voir",
  "groups-activity": "Fil d'activité de mes groupes",
  "update": "Modifier cette information",
  "delete": "Supprimer cette information",
    "deleteNewsWarning": "Supprimer cette information ?"
}
</i18n>
