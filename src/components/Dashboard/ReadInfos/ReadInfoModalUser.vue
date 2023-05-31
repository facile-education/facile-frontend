<template>
  <div
    class="read-info-user"
    :class="{'unread': !user.hasRead}"
  >
    <div class="userName">
      {{ user.fullName }}
    </div>
    <div class="readStatus">
      {{ user.hasRead ? formattedReadDate : $t('unread') }}
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'ReadInfoModalUser',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedReadDate () {
      if (this.user.readDate) {
        return dayjs(this.user.readDate, 'YYYY-MM-DD HH:mm:ss').calendar()
      } else {
        return ''
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

  &.unread {
    font-weight: bold;
  }
}
</style>

<i18n locale="fr" >
{
  "unread": "Non lu"
}
</i18n>
