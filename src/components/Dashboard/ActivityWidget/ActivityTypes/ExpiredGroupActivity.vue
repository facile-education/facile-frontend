<template>
  <div class="membership-activity">
    <div class="icon">
      <CustomIcon icon-name="icon-users" />
    </div>

    <div class="content">
      <div class="author">
        <i
          :title="activity.groupName"
          tabindex="0"
          @click="redirect"
          @keyup.enter="redirect"
        >
          {{ activity.groupName }}
        </i>
        <span>
          {{ ' - ' + $t('Dashboard.ExpiredGroupActivity.deactivation') }}
        </span>
      </div>
      <div class="description">
        <span>
          {{ description }}
        </span>
        <i
          v-t="'Dashboard.ExpiredGroupActivity.reactivate'"
          tabindex="0"
          @click="confirmGroupReactivation"
          @keyup.enter="confirmGroupReactivation"
        />
        <span> ?</span>
      </div>
    </div>

    <div
      class="date"
      :title="formattedDateLong"
    >
      {{ formattedDate }}
    </div>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { extendCommunity } from '@/api/groups.service'
import { GROUPS } from '@/constants/appConstants'

export default {
  name: 'ExpiredGroupActivity',
  components: { CustomIcon },
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  emits: ['refresh'],
  computed: {
    formattedDate () {
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).calendar()
    },
    formattedDateLong () {
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).format(this.$t('Dashboard.ExpiredGroupActivity.activityTimeFormat'))
    },
    description () {
      return this.$t('Dashboard.ExpiredGroupActivity.spaceIsDeactivated')
    }
  },
  methods: {
    redirect () {
      this.$router.push({ name: GROUPS, params: { groupId: this.activity.groupId } })
    },
    confirmGroupReactivation () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Dashboard.ExpiredGroupActivity.reactivationConfirmMessage', { groupName: this.activity.groupName }),
        lastAction: { fct: this.reactivateGroup, params: [] }
      })
    },
    reactivateGroup () {
      extendCommunity(this.activity.groupId).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Dashboard.ExpiredGroupActivity.extension-success'), type: 'info' })
          this.$emit('refresh')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.membership-activity {
  @extend %activity-item;
}

.icon {
  width: 30px;

  .icon-users {
    font-size: 30px;
    color: black;
    text-decoration: none !important;
  }
}
</style>
