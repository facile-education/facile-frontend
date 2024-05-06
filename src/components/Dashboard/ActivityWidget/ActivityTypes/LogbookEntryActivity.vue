<template>
  <div class="logbook-entry-activity">
    <div class="icon" />

    <div class="content">
      <div class="author">
        <a
          href="#"
          class="user-card-link-new-light toggle-user-card"
          @click.stop="openUserCardModal"
        >
          {{ activity.author.userName }}
        </a>
      </div>
      <div class="description">
        <span>
          <a
            href="#"
            style="color: black;"
            class="toggle-user-card"
            @click.stop="openUserCardModal"
          >
            {{ activity.author.userName + ' ' }}
          </a>
          <span>{{ $t('Dashboard.LogbookActivity.entryCreated') }}</span>
        </span>
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
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'

export default {
  name: 'DocActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate () {
      return dayjs(this.activity.modificationDate, DATE_EXCHANGE_FORMAT).calendar()
    }
  },
  methods: {
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', {
        userId: this.activity.author.userId
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  @import "@design";

  .logbook-entry-activity {
    @extend %activity-item;
  }

  </style>
