<template>
  <div>
    <span> {{ $t('readBy') + allReadMembers.length + $t('on') + allMembers.length }} </span>
  </div>
</template>

<script>
export default {
  name: 'ReadInfos',
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

</style>

<i18n locale="fr">
{
  "readBy": "Lu par ",
  "on": " destinataires sur "
}
</i18n>
