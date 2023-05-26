<template>
  <div class="news-activity">
    <div class="icon">
      <img
        class="img-icon"
        :src="thumbnail"
        alt="document icon"
      >
    </div>

    <div class="content">
      <div class="author">
        {{ news.authorName }}
      </div>
      <div class="description">
        <span>
          {{ news.title }}
        </span>
        <i
          v-t="'see'"
        />
      </div>
    </div>

    <div class="date">
      {{ formattedDate }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import validators from '@utils/validators'

export default {
  name: 'NewsActivity',
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  computed: {
    thumbnail () {
      if (validators.isValidURL(this.news.thumbnailUrl)) {
        return this.news.thumbnailUrl
      } else { // Returned url is a key for local default image
        return require('@assets/images/' + this.news.thumbnailUrl + '.svg')
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

  .description {
    display: flex;
    justify-content: space-between;
  }

  i {
    margin-right: 1rem;
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
