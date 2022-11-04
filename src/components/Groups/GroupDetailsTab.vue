<template>
  <div class="details-tab">
    <div class="expiration-date">
      {{ $t('expire') + formattedDate }}
    </div>

    <div
      v-if="group.description !== ''"
      class="description"
    >
      {{ group.description }}
    </div>

    <div class="actions" />"
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getCommunityMembers } from '@/api/groups.service'

export default {
  name: 'GroupDetailsTab',
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      members: []
    }
  },
  computed: {
    formattedDate () {
      return dayjs(this.group.expirationDate).format('DD MMM YYYY')
    }
  },
  created () {
    getCommunityMembers(this.group.groupId).then((data) => {
      if (data.success) {
        this.members = data.members
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.details-tab {
  .expiration-date {

  }

  .description {
    margin-top: 20px;
  }

  .actions {
    margin-top: 20px;
    border-top: 1px solid $color-border;
    border-bottom: 1px solid $color-border;
  }

  .members {
    margin-top: 20px;

    .nb-members {

    }

    .members-details {

    }
  }
}
</style>

<i18n locale="fr">
{
  "expire": "Expire le "
}
</i18n>
