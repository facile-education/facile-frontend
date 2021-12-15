<template>
  <div
    class="group-widget"
  >
    <div
      class="header"
    >
      <span>{{ $t('school-news') }}</span>
      <PentilaButton
        v-if="canAddSchoolNews"
        class="round"
        @click="openNewsModal"
      >
        <img
          class="delete-icon"
          src="@assets/add-white.svg"
          :alt="$t('add-group-news')"
          :title="$t('add-group-news')"
        >
      </PentilaButton>
    </div>
    <div class="body">
      <div
        v-for="news in schoolNews"
        :key="news.blogEntryId"
        class="news"
      >
        <News
          :news="news"
          :is-group-news="false"
        />
      </div>
    </div>
    <teleport to="body">
      <NewsModal
        v-if="isNewsModalDisplayed"
        :is-school-news="true"
        height="30em"
        @close="isNewsModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>
import News from '@/components/Dashboard/News/News.vue'
import NewsModal from '@/components/Dashboard/News/NewsModal.vue'

export default {
  name: 'SchoolNewsWidget',
  components: { News, NewsModal },
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
      return this.$store.state.dashboard.canAddSchoolNews
    }
  },
  created () {
    this.$store.dispatch('dashboard/getSchoolNews', { startIndex: this.startIndex, endIndex: this.endIndex })
  },
  methods: {
    openNewsModal () {
      this.$store.dispatch('dashboard/setEditedNews', {})
      this.isNewsModalDisplayed = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.group-widget {
  display: flex;
  flex-direction: column;
  height: 400px;
  max-height: 400px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  .header {
    margin: 0;
    padding: 10px 10px;
  }

.body {
    padding: 10px 15px;
  }
}
</style>

<i18n locale="fr">
{
  "school-news": "Annonces de l'établissement"
}
</i18n>
