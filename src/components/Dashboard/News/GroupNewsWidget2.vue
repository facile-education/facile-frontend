<template>
  <div
    class="group-news-widget"
  >
    <div
      class="header"
    >
      <span>{{ $t('groups-activity') }}</span>
      <PentilaButton
        v-if="canAddGroupNews"
        class="round"
        type="circle"
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
        v-for="activity in groupActivities"
        :key="activity.activityId"
        class="news"
      >
        <News
          v-if="activity.isNews"
          :news="activity"
          :is-group-news="true"
          @edit-news="isNewsModalDisplayed = true"
        />
        <DocActivity
          v-else-if="activity.type <= 8"
          :activity="activity"
        />
        <MembershipActivity
          v-else-if="activity.type <= 10"
          :activity="activity"
        />
        <RenvoiActivity
          v-else
          :activity="activity"
        />
      </div>
    </div>
    <teleport to="body">
      <NewsModal
        v-if="isNewsModalDisplayed"
        :is-school-news="false"
        height="30em"
        @close="isNewsModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>
import News from '@/components/Dashboard/News/News.vue'
import DocActivity from '@/components/Dashboard/Activities/DocActivity.vue'
import MembershipActivity from '@/components/Dashboard/Activities/MembershipActivity.vue'
import RenvoiActivity from '@/components/Dashboard/Activities/RenvoiActivity.vue'
import NewsModal from '@/components/Dashboard/News/NewsModal.vue'

export default {
  name: 'GroupNewsWidget2',
  components: { News, DocActivity, MembershipActivity, RenvoiActivity, NewsModal },
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
    groupActivities () {
      return this.$store.state.dashboard.groupActivities
    },
    canAddGroupNews () {
      return this.$store.state.dashboard.canAddGroupNews
    }
  },
  created () {
    this.$store.dispatch('dashboard/getGroupActivities', { startIndex: this.startIndex, endIndex: this.endIndex })
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

.group-news-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  .header {
    margin: 0;
    padding: 10px 10px;
    border-bottom: 1px grey;
    span {
      margin-right: 10px;
    }
  }

  .body {
    padding: 10px 15px;
    .news {
      padding: 5px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "groups-activity": "Fil d'activité de mes groupes",
  "add-group-news": "Créer une actualité"
}
</i18n>
