<template>
  <div class="read-info-user">
    <div class="userName">
      {{ user.fullName }}
    </div>
    <div class="readStatus">
      {{ user.hasRead ? $t('read'): $t('unread') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReadInfoModalUser',
  props: {
    user: {
      type: Object,
      required: true
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

<i18n locale="fr" >
{
  "read": "Lu",
  "unread": "Non lu"
}
</i18n>
