<template>
  <Widget
    :can-add-content="canAddGroupNews"
    @scrollReachBottom="loadGroupNews"
    @addContent="openNewsModal"
  >
    <template #header>
      <span class="widget-header">
        <BaseIcon
          class="header-icon"
          name="newspaper"
        />
        {{ $t('groups-activity') }}
      </span>
    </template>

    <template #default>
      <div
        v-for="activity in groupActivities"
        :key="activity.activityId"
        class="news"
      >
        <News
          v-if="activity.isNews"
          :news="activity"
          @edit-news="isNewsModalDisplayed = true"
        />
        <DocActivity
          v-else-if="activity.type <= activityTypes.TYPE_FOLDER_DELETION"
          :activity="activity"
        />
        <MembershipActivity
          v-else-if="activity.type <= activityTypes.TYPE_REMOVE_MEMBERSHIP"
          :activity="activity"
        />
        <RenvoiActivity
          v-else
          :activity="activity"
        />
      </div>
    </template>
  </Widget>

  <teleport to="body">
    <NewsModal
      v-if="isNewsModalDisplayed"
      :is-school-news="false"
      height="30em"
      @close="isNewsModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import Widget from '@components/Dashboard/Widget'
import NewsModal from '@components/Dashboard/News/NewsModal'
import News from '@components/Dashboard/News/News'
import DocActivity from '@components/Dashboard/Activities/DocActivity'
import MembershipActivity from '@components/Dashboard/Activities/MembershipActivity'
import RenvoiActivity from '@components/Dashboard/Activities/RenvoiActivity'
import BaseIcon from '@components/Base/BaseIcon'
import { nbActivityPerPage, activityTypes } from '@/constants/activityConstants'
import PentilaUtils from 'pentila-utils'
import dayjs from 'dayjs'

export default {
  name: 'UserThreadWidget',
  components: { BaseIcon, RenvoiActivity, MembershipActivity, DocActivity, News, NewsModal, Widget },
  data () {
    return {
      isNewsModalDisplayed: false,
      activityTypes: activityTypes
    }
  },
  computed: {
    groupActivities () {
      return PentilaUtils.Array.sortWithString(this.$store.state.dashboard.groupActivities, true, 'modificationDate')
    },
    canAddGroupNews () {
      return !!this.$store.state.dashboard.canAddGroupNews // '!!' to assure Boolean
    }
  },
  created () {
    this.loadGroupNews()
  },
  methods: {
    loadGroupNews () {
      this.$store.dispatch('dashboard/getGroupActivities', {
        maxDate: this.groupActivities.length > 0 ? this.groupActivities[this.groupActivities.length - 1].modificationDate : dayjs().format('YYYY-MM-DD HH:mm'),
        nbActivities: nbActivityPerPage
      })
    },
    openNewsModal () {
      this.$store.dispatch('dashboard/setEditedNews', {})
      this.isNewsModalDisplayed = true
    }
  }
}
</script>

<style lang="scss" scoped>

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
  "groups-activity": "Fil d'activité de mes groupes"
}
</i18n>
