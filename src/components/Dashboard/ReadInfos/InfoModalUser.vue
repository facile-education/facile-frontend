<template>
  <div class="read-info-user">
    <div class="userName">
      {{ fullName }}
    </div>
    <div class="status">
      {{ formattedStatus }}
    </div>
  </div>
</template>

<script>
import { getFullName } from '@utils/commons.util'
import dayjs from 'dayjs'

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
        return this.user[this.field] ? this.$t('done') : this.$t('unDone')
      } else if (this.field === 'hasRead') {
        return this.user[this.field] ? this.$t('read') + ' (' + dayjs(this.user.readDate, 'YYYY-MM-DD HH:mm:ss').calendar() + ')' : this.$t('unread')
      } else {
        return undefined
      }
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

<i18n locale="fr">
{
  "unread": "Non lu",
  "read": "Lu",
  "done": "Fait",
  "unDone": "Non fait"
}
</i18n>
