<template>
  <div class="read-info-user">
    <div class="userName">
      <a
        href="#"
        class="toggle-user-card"
        style="color: black;"
        @click.stop="openUserCardModal"
      >
        {{ fullName }}
      </a>
    </div>
    <div class="status">
      {{ formattedStatus }}
    </div>
  </div>
</template>

<script>
import { getFullName } from '@utils/commons.util'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'

export default {
  name: 'InfoModalUser',
  props: {
    user: {
      type: Object,
      required: true
    },
    field: {
      type: String,
      required: true
    }
  },
  computed: {
    fullName () {
      return getFullName(this.user)
    },
    formattedStatus () {
      if (this.field === 'isDone') {
        return this.user[this.field] ? this.$t('Dashboard.InfoModalUser.done') : this.$t('Dashboard.InfoModalUser.unDone')
      } else if (this.field === 'hasRead') {
        return this.user[this.field] ? this.$t('Dashboard.InfoModalUser.read') + ' (' + dayjs(this.user.readDate, DATE_EXCHANGE_FORMAT).calendar() + ')' : this.$t('Dashboard.InfoModalUser.unread')
      } else {
        return undefined
      }
    }
  },
  methods: {
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
.read-info-user {
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 2rem;
}
</style>
