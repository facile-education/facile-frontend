<template>
  <div>
    <BaseIcon
      class="check-icon"
      name="check"
    />
    <span> {{ allReadMembers.length + (allReadMembers.length > 1 ? $t('usersOn') : $t('userOn')) + allMembers.length }} </span>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'

export default {
  name: 'ReadInfos',
  components: { BaseIcon },
  props: {
    readInfos: {
      type: Array,
      required: true
    }
  },
  computed: {
    allMembers () {
      let allMembers = []
      this.readInfos.forEach((population) => {
        allMembers = [...allMembers, ...population.members]
      })
      return allMembers
    },
    allReadMembers () {
      return this.allMembers.filter(member => member.hasRead === true)
    }
  }
}
</script>

<style lang="scss" scoped>
.check-icon {
  color: green;
  margin-right: 5px;
}
</style>

<i18n locale="fr">
{
  "readBy": "Lu par ",
  "userOn": " destinataire sur ",
  "usersOn": " destinataires sur "
}
</i18n>
