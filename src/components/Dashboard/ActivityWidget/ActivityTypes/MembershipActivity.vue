<template>
  <div class="membership-activity">
    <div class="icon">
      <img
        class="img-icon"
        src="@/assets/icons/users.svg"
        alt="group icon"
      >
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
          {{ ' - ' + (isDeactivation ? $t('deactivation') : activity.author) }}
        </span>
      </div>
      <div class="description">
        <span>
          {{ description }}
        </span>
        <i
          v-if="isDeactivation"
          v-t="'reactivate'"
          tabindex="0"
          @click="confirmGroupReactivation"
          @keyup.enter="confirmGroupReactivation"
        />
        <span v-if="isDeactivation"> ?</span>
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
import { GROUPS } from '@/constants/appConstants'
import dayjs from 'dayjs'
import activityConstants from '@/constants/activityConstants'
import { extendCommunity } from '@/api/groups.service'

export default {
  name: 'MembershipActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  emits: ['refresh'],
  computed: {
    formattedDate () {
      return dayjs(this.activity.modificationDate, 'YYYY-MM-DD HH:mm').calendar()
    },
    formattedDateLong () {
      return dayjs(this.activity.modificationDate, 'YYYY-MM-DD HH:mm').format(this.$t('on') + ' DD MMMM YYYY ' + this.$t('at') + ' HH:mm')
    },
    isDeactivation () {
      return this.activity.type === activityConstants.TYPE_EXPIRED_GROUP
    },
    description () {
      switch (this.activity.type) {
        case activityConstants.TYPE_ADD_MEMBERSHIP:
          return this.$t('TYPE_ADD_MEMBERSHIP', { target: this.activity.target })
        case activityConstants.TYPE_EXPIRED_GROUP:
          return this.$t('TYPE_EXPIRED_GROUP')
        default:
          return 'Unknown activity type'
      }
    }
  },
  methods: {
    redirect () {
      this.$router.push({ name: GROUPS, params: { groupId: this.activity.groupId } })
    },
    confirmGroupReactivation () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('reactivationConfirmMessage', { groupName: this.activity.groupName }),
        lastAction: { fct: this.reactivateGroup, params: [] }
      })
    },
    reactivateGroup () {
      extendCommunity(this.activity.groupId).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('extension-success'), type: 'info' })
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
@import '@/design/index';

.membership-activity {
  @extend %activity-item;
}

.img-icon {
  width: 30px;
}
</style>

<i18n locale="fr">
{
  "TYPE_ADD_MEMBERSHIP": "vous a inscrit dans l'espace",
  "TYPE_EXPIRED_GROUP": "L'espace est désactivé. Voulez vous le ",
  "deactivation": "Désactivation",
  "reactivate": "réactiver",
  "reactivationConfirmMessage": "Voulez-vous vraiment réactiver le groupe {groupName} ?",
  "extension-success": "Groupe réactivé"
}
</i18n>
