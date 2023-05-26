<template>
  <div
    class="news-activity"
    tabindex="0"
    @click="isDetailsModalDisplayed=true"
    @keyup.enter="isDetailsModalDisplayed=true"
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
        <i>
          {{ news.groupName }}
        </i>
        <span>
          {{ ' - ' + news.authorName }}
        </span>
      </div>
      <div class="description">
        <span>
          {{ news.title }}
        </span>
        <i v-t="'see'" />
      </div>
    </div>

    <div class="date">
      {{ formattedDate }}
    </div>
  </div>

  <teleport
    v-if="isDetailsModalDisplayed"
    to="body"
  >
    <NewsActivityDetailsModal
      :init-news="news"
      @close="isDetailsModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import dayjs from 'dayjs'
import validators from '@utils/validators'
import { defineAsyncComponent } from 'vue'
const NewsActivityDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/NewsActivityDetailsModal.vue'))

export default {
  name: 'NewsActivity',
  components: { NewsActivityDetailsModal },
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isDetailsModalDisplayed: false
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
    confirmNewsDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteNewsWarning'),
        lastAction: { fct: this.deleteNews }
      })
    },
    deleteNews () {
      // TODO
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

.news-activity {
  @extend %activity-item;
  cursor: pointer;

  .description {
    display: flex;
    justify-content: space-between;
  }

  i {
    margin-right: 1rem;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 50%;
    }
  }
}

</style>

<i18n locale="fr">
{
  "see": "Voir",
  "groups-activity": "Fil d'activité de mes groupes",
  "edit": "Modifier cette actualité",
  "delete": "Supprimer cette actualité",
  "deleteContentWarning": "Supprimer cette actualité ?"
}
</i18n>
