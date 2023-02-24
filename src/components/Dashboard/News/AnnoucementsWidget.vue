<template>
  <Widget
    :can-add-content="canAddSchoolNews"
    @addContent="openNewsModal"
  >
    <template #header>
      <span class="widget-header">
        <BaseIcon
          class="header-icon"
          name="newspaper"
        />
        {{ $t('school-news') }}
      </span>
    </template>

    <template #default>
      <div
        v-for="news in schoolNews"
        :key="news.newsId"
        class="news"
      >
        <News
          :news="news"
        />
      </div>
    </template>
  </Widget>

  <teleport to="body">
    <NewsModal
      v-if="isNewsModalDisplayed"
      :is-school-news="true"
      height="30em"
      @close="isNewsModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import News from '@/components/Dashboard/News/News.vue'
import NewsModal from '@/components/Dashboard/News/NewsModal.vue'
import Widget from '@components/Dashboard/Widget'
import BaseIcon from '@components/Base/BaseIcon'
import dayjs from 'dayjs'

export default {
  name: 'AnnouncementsWidget',
  components: { BaseIcon, Widget, News, NewsModal },
  props: {
  },
  data () {
    return {
      startIndex: 0,
      endIndex: 10,
      isNewsModalDisplayed: false
    }
  },
  computed: {
    schoolNews () {
      return this.$store.state.dashboard.schoolNews
    },
    canAddSchoolNews () {
      return !!this.$store.state.dashboard.canAddSchoolNews
    }
  },
  created () {
    this.$store.dispatch('dashboard/getSchoolNews', { maxDate: dayjs().format('YYYY-MM-DD HH:mm'), nbNews: 10, importantOnly: false, unreadOnly: false })
  },
  methods: {
    openNewsModal () {
      this.$store.dispatch('dashboard/openNewsModal', {})
      this.isNewsModalDisplayed = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.widget-header {
  display: flex;
  align-items: center;

  .header-icon {
    font-size: 1.5rem;
    margin-right: 10px;
  }
}

.news {
  margin: 5px 0;
}
</style>

<i18n locale="fr">
{
  "school-news": "Annonces de l'établissement"
}
</i18n>
